import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'lib/db.json');

function getDb() {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

export async function GET() {
    const db = getDb();
    const ledger = db.ledger.map((entry: any) => ({
        ...entry,
        item: db.items.find((i: any) => i.id === entry.itemId),
        fromLocation: db.locations.find((l: any) => l.id === entry.fromLocationId),
        toLocation: db.locations.find((l: any) => l.id === entry.toLocationId),
        createdBy: db.users.find((u: any) => u.id === entry.userId) || { name: 'System' },
    }));
    return NextResponse.json(ledger);
}
