// app/page.js
"use client"; // Only add this if you are using client-side features like useState or useEffect

import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const fileType = selectedFile.type;
    const fileSizeLimit = 5 * 1024 * 1024; // 5 MB limit

    if (!['application/pdf', 'image/jpeg', 'image/png'].includes(fileType)) {
      alert('Please upload only PDF or image files.');
      return;
    }

    if (selectedFile.size > fileSizeLimit) {
      alert('File size should be less than 5MB.');
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    alert(`File uploaded! Access it at ${data.fileLink}`);
  };

  return (
    <div>
      <h1>File Upload</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept="application/pdf,image/*" />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}
