const fs = require('fs');
const path = require('path');

// Configuration
// Adjust path to point to backend source
const BACKEND_PERMISSIONS_PATH = path.join(__dirname, '../../backend/src/common/auth/permissions.ts');
const OUTPUT_PATH = path.join(__dirname, '../permissions/generated.ts');

function extractPermissions(fileContent) {
    // Regex to find the permissions object body
    const match = fileContent.match(/export const PERMISSIONS = \{([\s\S]*?)\} as const;/);
    if (!match) throw new Error('Could not find PERMISSIONS object in backend file');

    const body = match[1];
    const permissions = [];
    const lines = body.split('\n');

    for (const line of lines) {
        // Match: KEY: 'value',
        // Example: USERS_READ: 'users.read',
        const lineMatch = line.match(/\w+:\s*'([^']+)'/);
        if (lineMatch) {
            permissions.push(lineMatch[1]);
        }
    }

    return permissions;
}

function generateContent(permissions) {
    const lines = [
        '// This file is auto-generated. Do not edit directly.',
        '// Run "npm run generate-permissions" to update.',
        '',
        'export const PERMISSIONS = {'
    ];

    permissions.sort().forEach(p => {
        const key = p.toUpperCase().replace(/\./g, '_').replace(/-/g, '_');
        lines.push(`    ${key}: '${p}',`);
    });

    lines.push('} as const;', '');
    lines.push('export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];');

    return lines.join('\n');
}

async function main() {
    try {
        console.log(`Reading permissions from ${BACKEND_PERMISSIONS_PATH}...`);
        if (!fs.existsSync(BACKEND_PERMISSIONS_PATH)) {
            throw new Error(`Backend file not found at ${BACKEND_PERMISSIONS_PATH}`);
        }

        const content = fs.readFileSync(BACKEND_PERMISSIONS_PATH, 'utf8');
        const permissions = extractPermissions(content);

        console.log(`Found ${permissions.length} permissions.`);

        const output = generateContent(permissions);
        fs.writeFileSync(OUTPUT_PATH, output);
        console.log(`✅ Generated permissions to ${OUTPUT_PATH}`);
    } catch (err) {
        console.error('❌ Failed to generate permissions:', err.message);
        process.exit(1);
    }
}

main();
