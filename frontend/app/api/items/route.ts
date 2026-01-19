import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'lib/db.json');

function getDb() {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
}

export async function GET() {
    try {
        const db = getDb();
        // Populate categories and UOMs for the items
        const items = db.items.map((item: any) => ({
            ...item,
            category: db.categories.find((c: any) => c.id === item.categoryId),
            uom: db.uoms.find((u: any) => u.id === item.uomId),
        }));
        return NextResponse.json(items);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
    }
}
