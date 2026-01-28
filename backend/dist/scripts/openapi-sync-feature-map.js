#!/usr/bin/env ts-node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const axios_1 = __importDefault(require("axios"));
const FEATURE_MAP_PATH = path.join(__dirname, '../../frontend/docs/frontend-feature-map.md');
const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';
const SMOKE_REPORT_PATH = path.join(__dirname, '../../frontend/docs/openapi-smoke-report.json');
async function fetchOpenAPISpec() {
    try {
        const response = await axios_1.default.get(`${BASE_URL}/docs-json`);
        return response.data;
    }
    catch (error) {
        console.error('Failed to fetch OpenAPI spec:', error.message);
        console.error('Make sure the backend is running with SWAGGER_ENABLED=true');
        process.exit(1);
    }
}
function parseFeatureMap(content) {
    const lines = content.split('\n');
    const rows = [];
    let inTable = false;
    for (const line of lines) {
        if (line.startsWith('|') && line.includes('Feature')) {
            inTable = true;
            continue;
        }
        if (line.startsWith('|---'))
            continue;
        if (!line.startsWith('|')) {
            inTable = false;
            continue;
        }
        if (!inTable)
            continue;
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
function endpointExists(spec, endpoint) {
    if (!endpoint || endpoint === '-' || endpoint === 'N/A')
        return false;
    const match = endpoint.match(/^(GET|POST|PUT|PATCH|DELETE)\s+(.+)$/);
    if (!match)
        return false;
    const [, method, path] = match;
    const normalizedPath = path.replace(/:(\w+)/g, '{$1}');
    const pathObj = spec.paths[normalizedPath];
    if (!pathObj)
        return false;
    return !!pathObj[method.toLowerCase()];
}
async function smokeTest(endpoint, token) {
    if (!endpoint || endpoint === '-' || endpoint === 'N/A')
        return false;
    const match = endpoint.match(/^(GET|POST|PUT|PATCH|DELETE)\s+(.+)$/);
    if (!match)
        return false;
    const [, method, path] = match;
    const testPath = path.replace(/:id/g, 'test-id-123');
    try {
        const response = await (0, axios_1.default)({
            method: method.toLowerCase(),
            url: `${BASE_URL}${testPath}`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
            validateStatus: () => true,
        });
        if (response.status === 404 || response.status === 405) {
            return false;
        }
        return true;
    }
    catch (error) {
        return false;
    }
}
async function syncFeatureMap(smokeMode = false) {
    console.log('🔄 Syncing feature map with OpenAPI spec...\n');
    const spec = await fetchOpenAPISpec();
    console.log(`✅ Fetched OpenAPI spec from ${BASE_URL}/docs-json\n`);
    const content = fs.readFileSync(FEATURE_MAP_PATH, 'utf-8');
    const rows = parseFeatureMap(content);
    console.log(`📋 Found ${rows.length} rows in feature map\n`);
    const result = {
        totalRows: rows.length,
        turnedLive: 0,
        stillPending: 0,
        missingEndpoints: {},
    };
    let token = '';
    if (smokeMode) {
        console.log('🔥 Smoke test mode enabled');
        token = process.env.ADMIN_JWT || '';
        if (!token) {
            console.warn('⚠️  No ADMIN_JWT provided, smoke tests will be limited\n');
        }
    }
    const smokeResults = [];
    for (const row of rows) {
        const oldStatus = row.beStatus;
        let newStatus = oldStatus;
        if (row.endpoint && row.endpoint !== '-' && row.endpoint !== 'N/A') {
            let exists = endpointExists(spec, row.endpoint);
            if (smokeMode && token && !exists) {
                exists = await smokeTest(row.endpoint, token);
                smokeResults.push({
                    endpoint: row.endpoint,
                    exists,
                    method: exists ? 'smoke' : 'not-found',
                });
            }
            if (exists) {
                if (oldStatus !== 'FALLBACK') {
                    newStatus = 'LIVE';
                }
                else {
                    newStatus = 'LIVE';
                }
            }
            else {
                if (oldStatus === 'TBD' || oldStatus === 'LIVE') {
                    newStatus = 'PENDING';
                }
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
            }
            else {
                newContent += line + '\n';
            }
        }
        else {
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
    }
    else {
        console.log('✅ All endpoints are LIVE!');
    }
    if (smokeMode && smokeResults.length > 0) {
        fs.writeFileSync(SMOKE_REPORT_PATH, JSON.stringify(smokeResults, null, 2));
        console.log(`\n🔥 Smoke test results saved to ${SMOKE_REPORT_PATH}`);
    }
    console.log(`\n✅ Feature map updated at ${FEATURE_MAP_PATH}`);
}
const smokeMode = process.argv.includes('--smoke');
syncFeatureMap(smokeMode).catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
});
//# sourceMappingURL=openapi-sync-feature-map.js.map