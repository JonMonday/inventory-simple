import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'lib/db.json');

function getDb() {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
}

export async function POST(req: NextRequest) {
    try {
        const { username, password } = await req.json();
        const db = getDb();
        const user = db.users.find((u: any) => u.username === username && u.password === password);

        if (user) {
            // Mock token for simulation
            return NextResponse.json({
                access_token: `mock-token-${user.id}`,
                user: { id: user.id, name: user.name, role: user.role }
            });
        }

        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
