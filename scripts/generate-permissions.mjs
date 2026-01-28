import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const SHARED_JSON_PATH = path.join(ROOT_DIR, 'shared', 'permissions.json');
const BACKEND_OUTPUT_PATH = path.join(ROOT_DIR, 'backend', 'src', 'common', 'auth', 'permissions.generated.ts');
const FRONTEND_OUTPUT_PATH = path.join(ROOT_DIR, 'frontend', 'src', 'permissions', 'permissions.generated.ts');

// Ensure frontend directory exists (it might be under frontend/permissions/ instead of frontend/src/permissions/)
// Based on previous context, frontend path is frontend/permissions/matrix.ts, so let's target frontend/permissions/permissions.generated.ts
const FRONTEND_OUTPUT_Corrected = path.join(ROOT_DIR, 'frontend', 'permissions', 'permissions.generated.ts');

console.log('Reading permissions from:', SHARED_JSON_PATH);

try {
    const rawData = fs.readFileSync(SHARED_JSON_PATH, 'utf8');
    const { permissions } = JSON.parse(rawData);

    if (!Array.isArray(permissions)) {
        throw new Error('Permissions array missing in JSON');
    }

    const content = generateContent(permissions);

    // Write Backend
    fs.writeFileSync(BACKEND_OUTPUT_PATH, content);
    console.log(`✅ Backend permissions written to: ${BACKEND_OUTPUT_PATH}`);

    // Write Frontend
    // Ensure dir exists
    const feDir = path.dirname(FRONTEND_OUTPUT_Corrected);
    if (!fs.existsSync(feDir)) {
        fs.mkdirSync(feDir, { recursive: true });
    }
    fs.writeFileSync(FRONTEND_OUTPUT_Corrected, content);
    console.log(`✅ Frontend permissions written to: ${FRONTEND_OUTPUT_Corrected}`);

} catch (err) {
    console.error('❌ Error generating permissions:', err);
    process.exit(1);
}

function generateContent(permissions) {
    const lines = [
        '// ----------------------------------------------------------------------------',
        '// THIS FILE IS GENERATED AUTOMATICALLY. DO NOT EDIT DIRECTLY.',
        '// Source: /shared/permissions.json',
        '// Run: npm run generate:permissions',
        '// ----------------------------------------------------------------------------',
        '',
    ];

    // 1. Generate PERMISSIONS constant
    lines.push('export const PERMISSIONS = {');

    // Sort to ensure deterministic output
    const sorted = [...permissions].sort((a, b) => a.key.localeCompare(b.key));

    sorted.forEach(p => {
        // key: "storeLocations.read" -> CONST: "STORE_LOCATIONS_READ"
        // 1. Insert underscore before caps (camelCase to snake_case)
        // 2. Replace dots/dashes with underscores
        // 3. Uppercase
        const constName = p.key
            .replace(/([a-z])([A-Z])/g, '$1_$2')
            .toUpperCase()
            .replace(/[\.-]/g, '_');

        lines.push(`    ${constName}: '${p.key}',`);
    });
    lines.push('} as const;');
    lines.push('');

    // 2. Export strict type
    lines.push('export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];');
    lines.push('');

    // 3. Export Meta for UI usage
    lines.push('export const PERMISSIONS_META = [');
    sorted.forEach(p => {
        lines.push(`    { key: '${p.key}', label: '${p.label}', group: '${p.group}' },`);
    });
    lines.push('] as const;');
    lines.push('');

    return lines.join('\n');
}
