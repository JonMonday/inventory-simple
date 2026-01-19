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

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { status } = await req.json();
    const db = getDb();

    const requestIndex = db.requests.findIndex((r: any) => r.id === id);
    if (requestIndex === -1) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    db.requests[requestIndex].status = status;

    // If approved, update stock if it's a move/reassignment
    if (status === 'APPROVED') {
        const request = db.requests[requestIndex];
        if (request.type === 'REASSIGNMENT') {
            const itemIndex = db.items.findIndex((i: any) => i.id === request.itemId);
            if (itemIndex !== -1) {
                // Subtract from 'from' location
                const fromSnap = db.items[itemIndex].snapshots.find((s: any) => s.locationId === request.fromLocationId);
                if (fromSnap) fromSnap.quantity -= request.quantity;

                // Add to 'to' location
                let toSnap = db.items[itemIndex].snapshots.find((s: any) => s.locationId === request.toLocationId);
                if (!toSnap) {
                    toSnap = { locationId: request.toLocationId, quantity: 0 };
                    db.items[itemIndex].snapshots.push(toSnap);
                }
                toSnap.quantity += request.quantity;

                // Add ledger entry
                db.ledger.push({
                    id: `l${Date.now()}`,
                    itemId: request.itemId,
                    type: 'MOVE',
                    quantity: request.quantity,
                    locationId: request.toLocationId,
                    userId: 'system',
                    timestamp: new Date().toISOString()
                });
            }
        }
    }

    saveDb(db);
    return NextResponse.json(db.requests[requestIndex]);
}
