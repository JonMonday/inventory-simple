#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

interface FeatureMapRow {
    feature: string;
    route: string;
    endpoint: string;
    feStatus: string;
    beStatus: string;
    notes: string;
}

interface OpenAPIPath {
    [method: string]: any;
}

interface OpenAPISpec {
    paths: {
        [path: string]: OpenAPIPath;
    };
}

interface SyncResult {
    totalRows: number;
    turnedLive: number;
    stillPending: number;
    missingEndpoints: { [module: string]: string[] };
}

const FEATURE_MAP_PATH = path.join(__dirname, '../../frontend/docs/frontend-feature-map.md');
const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';
const SMOKE_REPORT_PATH = path.join(__dirname, '../../frontend/docs/openapi-smoke-report.json');

async function fetchOpenAPISpec(): Promise<OpenAPISpec> {
    try {
        const response = await axios.get(`${BASE_URL}/docs-json`);
        return response.data;
    } catch (error: any) {
        console.error('Failed to fetch OpenAPI spec:', error.message);
        console.error('Make sure the backend is running with SWAGGER_ENABLED=true');
        process.exit(1);
    }
}

function parseFeatureMap(content: string): FeatureMapRow[] {
    const lines = content.split('\n');
    const rows: FeatureMapRow[] = [];
    let inTable = false;

    for (const line of lines) {
        if (line.startsWith('|') && line.includes('Feature')) {
            inTable = true;
            continue;
        }
        if (line.startsWith('|---')) continue;
        if (!line.startsWith('|')) {
            inTable = false;
            continue;
        }
        if (!inTable) continue;

        const cells = line.split('|').map(c => c.trim()).filter(c => c);
        if (cells.length >= 6) {
            rows.push({
                feature: cells[0],
                route: cells[1],
                endpoint: cells[2],
                feStatus: cells[3],
                beStatus: cells[4],
                notes: cells[5],
            });
        }
    }

    return rows;
}

function endpointExists(spec: OpenAPISpec, endpoint: string): boolean {
    if (!endpoint || endpoint === '-' || endpoint === 'N/A') return false;

    // Parse endpoint like "GET /requests" or "POST /requests/:id/submit"
    const match = endpoint.match(/^(GET|POST|PUT|PATCH|DELETE)\s+(.+)$/);
    if (!match) return false;

    const [, method, path] = match;
    const normalizedPath = path.replace(/:(\w+)/g, '{$1}'); // Convert :id to {id}

    const pathObj = spec.paths[normalizedPath];
    if (!pathObj) return false;

    return !!pathObj[method.toLowerCase()];
}

async function smokeTest(endpoint: string, token: string): Promise<boolean> {
    if (!endpoint || endpoint === '-' || endpoint === 'N/A') return false;

    const match = endpoint.match(/^(GET|POST|PUT|PATCH|DELETE)\s+(.+)$/);
    if (!match) return false;

    const [, method, path] = match;
    // Replace :id with a test ID (won't work for all endpoints, but gives us a signal)
    const testPath = path.replace(/:id/g, 'test-id-123');

    try {
        const response = await axios({
            method: method.toLowerCase(),
            url: `${BASE_URL}${testPath}`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
            validateStatus: () => true, // Don't throw on any status
        });

        // If we get 404 or 405, endpoint doesn't exist
        if (response.status === 404 || response.status === 405) {
            return false;
        }

        // Any other response means endpoint exists
        return true;
    } catch (error) {
        return false;
    }
}

async function syncFeatureMap(smokeMode: boolean = false): Promise<void> {
    console.log('🔄 Syncing feature map with OpenAPI spec...\n');

    const spec = await fetchOpenAPISpec();
    console.log(`✅ Fetched OpenAPI spec from ${BASE_URL}/docs-json\n`);

    const content = fs.readFileSync(FEATURE_MAP_PATH, 'utf-8');
    const rows = parseFeatureMap(content);

    console.log(`📋 Found ${rows.length} rows in feature map\n`);

    const result: SyncResult = {
        totalRows: rows.length,
        turnedLive: 0,
        stillPending: 0,
        missingEndpoints: {},
    };

    let token = '';
    if (smokeMode) {
        console.log('🔥 Smoke test mode enabled');
        // Try to get a token (this would need to be provided or fetched)
        token = process.env.ADMIN_JWT || '';
        if (!token) {
            console.warn('⚠️  No ADMIN_JWT provided, smoke tests will be limited\n');
        }
    }

    const smokeResults: any[] = [];

    for (const row of rows) {
        const oldStatus = row.beStatus;
        let newStatus = oldStatus;

        if (row.endpoint && row.endpoint !== '-' && row.endpoint !== 'N/A') {
            let exists = endpointExists(spec, row.endpoint);

            if (smokeMode && token && !exists) {
                // Try smoke test as fallback
                exists = await smokeTest(row.endpoint, token);
                smokeResults.push({
                    endpoint: row.endpoint,
                    exists,
                    method: exists ? 'smoke' : 'not-found',
                });
            }

            if (exists) {
                // If endpoint exists in OpenAPI, mark as LIVE (unless it's explicitly FALLBACK)
                if (oldStatus !== 'FALLBACK') {
                    newStatus = 'LIVE';
                } else {
                    // For FALLBACK, only change to LIVE if the exact endpoint exists
                    newStatus = 'LIVE';
                }
            } else {
                // Endpoint missing
                if (oldStatus === 'TBD' || oldStatus === 'LIVE') {
                    newStatus = 'PENDING';
                }

                // Track missing endpoint
                const module = row.feature.split(' ')[0] || 'Unknown';
                if (!result.missingEndpoints[module]) {
                    result.missingEndpoints[module] = [];
                }
                result.missingEndpoints[module].push(row.endpoint);
            }
        }

        if (newStatus === 'LIVE' && oldStatus !== 'LIVE') {
            result.turnedLive++;
        }
        if (newStatus === 'PENDING') {
            result.stillPending++;
        }

        row.beStatus = newStatus;
    }

    // Rebuild the markdown table
    const lines = content.split('\n');
    let newContent = '';
    let rowIndex = 0;
    let inTable = false;

    for (const line of lines) {
        if (line.startsWith('|') && line.includes('Feature')) {
            inTable = true;
            newContent += line + '\n';
            continue;
        }
        if (line.startsWith('|---')) {
            newContent += line + '\n';
            continue;
        }
        if (line.startsWith('|') && inTable) {
            const row = rows[rowIndex];
            if (row) {
                newContent += `| ${row.feature} | ${row.route} | ${row.endpoint} | ${row.feStatus} | ${row.beStatus} | ${row.notes} |\n`;
                rowIndex++;
            } else {
                newContent += line + '\n';
            }
        } else {
            inTable = false;
            newContent += line + '\n';
        }
    }

    fs.writeFileSync(FEATURE_MAP_PATH, newContent);

    console.log('📊 Sync Results:');
    console.log(`   Total rows processed: ${result.totalRows}`);
    console.log(`   Turned LIVE: ${result.turnedLive}`);
    console.log(`   Still PENDING: ${result.stillPending}`);
    console.log('');

    if (Object.keys(result.missingEndpoints).length > 0) {
        console.log('❌ Missing Endpoints by Module:');
        for (const [module, endpoints] of Object.entries(result.missingEndpoints)) {
            console.log(`\n   ${module}:`);
            endpoints.forEach(ep => console.log(`     - ${ep}`));
        }
    } else {
        console.log('✅ All endpoints are LIVE!');
    }

    if (smokeMode && smokeResults.length > 0) {
        fs.writeFileSync(SMOKE_REPORT_PATH, JSON.stringify(smokeResults, null, 2));
        console.log(`\n🔥 Smoke test results saved to ${SMOKE_REPORT_PATH}`);
    }

    console.log(`\n✅ Feature map updated at ${FEATURE_MAP_PATH}`);
}

// Main execution
const smokeMode = process.argv.includes('--smoke');
syncFeatureMap(smokeMode).catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
});
