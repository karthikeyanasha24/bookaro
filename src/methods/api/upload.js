// Simple file upload utility for backend integration

export async function uploadFiles(files = []) {
  const BASE_URL = process.env.REACT_APP_MARKETPLACE_API_URL || 'http://localhost:6090';
  const token = localStorage.getItem('token');
  const formData = new FormData();
  files.forEach(f => formData.append('files', f));

  const res = await fetch(`${BASE_URL}/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  });
  if (!res.ok) throw new Error('Upload failed');
  return res.json(); // Expecting { files: [{ url, name, ... }] }
}
