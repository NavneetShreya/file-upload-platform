import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');

  // Check if file is provided
  if (!file) {
    return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
  }

  // Validate file type and size (5MB limit)
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  const fileSizeLimit = 5 * 1024 * 1024; // 5MB limit

  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ success: false, message: 'Invalid file type. Only PDF, JPEG, and PNG are allowed.' }, { status: 400 });
  }

  if (file.size > fileSizeLimit) {
    return NextResponse.json({ success: false, message: 'File size should be less than 5MB.' }, { status: 400 });
  }

  // Create unique filename
  const uniqueId = nanoid();
  const filePath = path.join(process.cwd(), 'public', 'uploads', uniqueId + '-' + file.name);

  try {
    // Ensure the 'uploads' directory exists
    const dirPath = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Save the file to disk
    await fs.promises.writeFile(filePath, Buffer.from(await file.arrayBuffer()));

    // Return the file URL
    const fileLink = `/uploads/${uniqueId}-${file.name}`;
    return NextResponse.json({ success: true, fileLink });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error uploading file', error: error.message }, { status: 500 });
  }
}
