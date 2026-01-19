import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'lib/db.json');

function getDb() {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const db = getDb();

    if (type === 'locations') return NextResponse.json(db.locations);
    if (type === 'categories') return NextResponse.json(db.categories);
    if (type === 'uoms') return NextResponse.json(db.uoms);

    return NextResponse.json({
        locations: db.locations,
        categories: db.categories,
        uoms: db.uoms,
        users: db.users.map((u: any) => ({ id: u.id, name: u.name, role: u.role }))
    });
}
