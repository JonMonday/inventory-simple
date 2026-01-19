import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'lib/db.json');

function getDb() {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function saveDb(db: any) {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

export async function GET() {
    const db = getDb();
    const requests = db.requests.map((r: any) => ({
        ...r,
        item: db.items.find((i: any) => i.id === r.itemId),
        requester: db.users.find((u: any) => u.id === r.requesterId),
        fromLocation: db.locations.find((l: any) => l.id === r.fromLocationId),
        toLocation: db.locations.find((l: any) => l.id === r.toLocationId),
    }));
    return NextResponse.json(requests);
}

export async function POST(req: NextRequest) {
    const db = getDb();
    const data = await req.json();
    const newRequest = {
        ...data,
        id: `r${Date.now()}`,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
    };
    db.requests.push(newRequest);
    saveDb(db);
    return NextResponse.json(newRequest);
}
