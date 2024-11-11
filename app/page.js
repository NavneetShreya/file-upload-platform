"use client"; // Only add this if you are using client-side features like useState or useEffect

import { useState } from 'react';

export default function Page() {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(""); // To store the URL of the uploaded file

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

    if (data.success) {
      setFileUrl(data.fileLink); // Set the URL of the uploaded file
    } else {
      alert('File upload failed!');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>File Upload</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            onChange={handleFileChange}
            accept="application/pdf,image/*"
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Upload</button>
        </form>

        {fileUrl && (
          <div style={styles.successMessage}>
            File uploaded successfully! Access it <a href={fileUrl} target="_blank" rel="noopener noreferrer" style={styles.link}>here</a>.
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#000',
    color: '#fff',
    fontFamily: 'Arial, sans-serif',
  },
  card: {
    textAlign: 'center',
    backgroundColor: '#222',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    width: '300px',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#FFD700', // Gold color
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '20px',
    border: '2px solid #FFD700', // Gold border
    borderRadius: '5px',
    backgroundColor: '#333',
    color: '#fff',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#FFD700', // Gold button
    border: 'none',
    borderRadius: '5px',
    color: '#000',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  buttonHover: {
    backgroundColor: '#e0a800',
  },
  successMessage: {
    marginTop: '20px',
    color: '#FFD700',
    fontSize: '14px',
  },
  link: {
    color: '#FFD700',
    textDecoration: 'none',
  }
};
