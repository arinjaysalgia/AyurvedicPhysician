const TOKEN_KEY = 'admin_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export async function login(password: string): Promise<string> {
  const res = await fetch('/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Login failed');
  }
  const { token } = await res.json();
  setToken(token);
  return token;
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

export async function fetchPosts(status?: string) {
  const params = status ? `?status=${status}` : '';
  const res = await fetch(`/api/posts${params}`, { headers: authHeaders() });
  if (res.status === 401) throw new Error('Session expired');
  return res.json();
}

export async function fetchPost(slug: string) {
  const res = await fetch(`/api/posts?slug=${encodeURIComponent(slug)}`, {
    headers: authHeaders(),
  });
  if (res.status === 401) throw new Error('Session expired');
  if (!res.ok) throw new Error('Post not found');
  return res.json();
}

export async function createPost(data: Record<string, unknown>) {
  const res = await fetch('/api/posts', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (res.status === 401) throw new Error('Session expired');
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create post');
  }
  return res.json();
}

export async function updatePost(data: Record<string, unknown>) {
  const res = await fetch('/api/posts', {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (res.status === 401) throw new Error('Session expired');
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to update post');
  }
  return res.json();
}

export async function deletePost(slug: string) {
  const res = await fetch(`/api/posts?slug=${encodeURIComponent(slug)}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (res.status === 401) throw new Error('Session expired');
  return res.json();
}

export async function fetchCategories(): Promise<string[]> {
  const res = await fetch('/api/categories', { headers: authHeaders() });
  if (res.status === 401) throw new Error('Session expired');
  return res.json();
}

export async function addCategory(category: string): Promise<string[]> {
  const res = await fetch('/api/categories', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ category }),
  });
  return res.json();
}

export async function removeCategory(category: string): Promise<string[]> {
  const res = await fetch(`/api/categories?category=${encodeURIComponent(category)}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return res.json();
}

export async function fetchTags(): Promise<string[]> {
  const res = await fetch('/api/tags', { headers: authHeaders() });
  if (res.status === 401) throw new Error('Session expired');
  return res.json();
}

export async function addTag(tag: string): Promise<string[]> {
  const res = await fetch('/api/tags', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ tag }),
  });
  return res.json();
}

export async function removeTag(tag: string): Promise<string[]> {
  const res = await fetch(`/api/tags?tag=${encodeURIComponent(tag)}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return res.json();
}

export async function fetchImages() {
  const res = await fetch('/api/images', { headers: authHeaders() });
  if (res.status === 401) throw new Error('Session expired');
  return res.json();
}

export async function uploadImage(file: File) {
  const token = getToken();
  const form = new FormData();
  form.append('file', file);
  const res = await fetch('/api/images', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Upload failed');
  }
  return res.json();
}

export async function deleteImage(key: string) {
  const res = await fetch(`/api/images?key=${encodeURIComponent(key)}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return res.json();
}
