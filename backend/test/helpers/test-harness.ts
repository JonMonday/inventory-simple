import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';

export class TestHarness {
    private static tokens: Map<string, string> = new Map();
    private prisma: PrismaClient;

    constructor() {
        const url = process.env.DATABASE_URL || 'file:./dev.db';
        const adapter = new PrismaBetterSqlite3({ url: url.replace('file:', '') });
        this.prisma = new PrismaClient({ adapter });
    }

    static async initDb(databaseUrl: string) {
        console.log(`Initializing E2E Database: ${databaseUrl}`);

        // Ensure tmp dir exists
        const tmpDir = path.join(process.cwd(), 'tmp');
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

        process.env.DATABASE_URL = databaseUrl;

        // Reset DB
        execSync(`DATABASE_URL=${databaseUrl} npx prisma db push --force-reset`, { stdio: 'inherit', env: process.env });

        // Run Test Seed
        execSync(`DATABASE_URL=${databaseUrl} npx ts-node prisma/test-seed.ts`, { stdio: 'inherit', env: process.env });
    }

    async loginAllUsers(app: INestApplication, mode: 'FAST' | 'FULL' = 'FAST') {
        // Always reset tokens map for new test runs if sharing harness instances, though typical usage is one harness per suite.
        // Actually, static tokens logic might be problematic if multiple suites run in parallel or sequence with different DBs.
        // For E2E tests, usually we want fresh logins against the current app instance.
        // Let's clear it if the mode changes or just re-login.
        // Safety: Clear tokens.
        TestHarness.tokens.clear();

        console.log(`Logging in users (Mode: ${mode})...`);
        const users = await this.prisma.user.findMany({
            include: { roles: { include: { role: true } } }
        });

        const usersToLogin = mode === 'FAST'
            ? this.sampleUsers(users)
            : users;

        console.log(`Authenticating ${usersToLogin.length} users...`);

        if (mode === 'FAST') {
            await Promise.all(usersToLogin.map(async (user) => {
                await this.loginUser(app, user);
            }));
        } else {
            // Sequential or small batches for FULL mode to prevent ECONNRESET
            for (const user of usersToLogin) {
                await this.loginUser(app, user);
            }
        }
        return TestHarness.tokens;
    }

    private async loginUser(app: INestApplication, user: any) {
        const response = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: user.email, password: 'Passw0rd!' });

        if (response.status === 201 || response.status === 200) {
            TestHarness.tokens.set(user.email, response.body.access_token);
        } else {
            console.error(`Failed to login user ${user.email}:`, response.body);
        }
    }

    private sampleUsers(users: any[]) {
        // Pick first 2 users per role
        const sampled = new Map<string, any[]>();
        for (const user of users) {
            const roleName = user.roles[0]?.role?.name || 'Unknown';
            if (!sampled.has(roleName)) sampled.set(roleName, []);
            if (sampled.get(roleName)!.length < 2) {
                sampled.get(roleName)!.push(user);
            }
        }
        return Array.from(sampled.values()).flat();
    }

    getTokens() {
        return TestHarness.tokens;
    }

    async cleanup() {
        await this.prisma.$disconnect();
    }
}
