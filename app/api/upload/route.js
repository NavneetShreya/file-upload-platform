import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';

// app/api/upload/route.js

export async function POST(req) {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) return NextResponse.json({ error: 'No file uploaded' });

    const uniqueId = nanoid();
    const filePath = path.join(process.cwd(), 'Database', uniqueId + '-' + file.name);

    // Save the file
    await fs.promises.writeFile(filePath, Buffer.from(await file.arrayBuffer()));

    // Return the unique link
    return NextResponse.json({ fileLink: `/Database/${uniqueId}-${file.name}` });
}