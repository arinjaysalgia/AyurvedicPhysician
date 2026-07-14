import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

const root = resolve(__dirname, '..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf-8');

describe('Phase 10: Blog Admin Panel', () => {
  describe('API endpoints exist', () => {
    const endpoints = [
      'functions/api/auth.ts',
      'functions/api/posts.ts',
      'functions/api/images.ts',
      'functions/api/categories.ts',
      'functions/api/tags.ts',
    ];

    endpoints.forEach((file) => {
      it(`${file} exists`, () => {
        expect(existsSync(resolve(root, file))).toBe(true);
      });
    });
  });

  describe('Auth API (functions/api/auth.ts)', () => {
    const auth = read('functions/api/auth.ts');

    it('exports onRequestPost handler', () => {
      expect(auth).toContain('export const onRequestPost');
    });

    it('exports onRequestOptions handler', () => {
      expect(auth).toContain('export const onRequestOptions');
    });

    it('exports verifyJWT function', () => {
      expect(auth).toContain('export async function verifyJWT');
    });

    it('uses HMAC SHA-256 for JWT signing', () => {
      expect(auth).toContain("hash: 'SHA-256'");
      expect(auth).toContain("name: 'HMAC'");
    });

    it('creates JWT with 24-hour expiry', () => {
      expect(auth).toContain('86400');
    });

    it('validates password against env var', () => {
      expect(auth).toContain('env.ADMIN_PASSWORD');
    });

    it('returns 401 for invalid password', () => {
      expect(auth).toContain('status: 401');
    });

    it('returns token on success', () => {
      expect(auth).toContain("{ token }");
    });

    it('has CORS headers', () => {
      expect(auth).toContain('Access-Control-Allow-Origin');
    });
  });

  describe('Posts API (functions/api/posts.ts)', () => {
    const posts = read('functions/api/posts.ts');

    it('imports verifyJWT from auth', () => {
      expect(posts).toContain("from './auth'");
    });

    it('exports GET handler', () => {
      expect(posts).toContain('export const onRequestGet');
    });

    it('exports POST handler (create)', () => {
      expect(posts).toContain('export const onRequestPost');
    });

    it('exports PUT handler (update)', () => {
      expect(posts).toContain('export const onRequestPut');
    });

    it('exports DELETE handler', () => {
      expect(posts).toContain('export const onRequestDelete');
    });

    it('authenticates all requests', () => {
      const authChecks = posts.match(/authenticate\(request/g);
      expect(authChecks?.length).toBeGreaterThanOrEqual(4);
    });

    it('validates required fields on create', () => {
      expect(posts).toContain('Title, slug, and content are required');
    });

    it('checks for duplicate slugs', () => {
      expect(posts).toContain('Slug already exists');
    });

    it('rebuilds index after mutations', () => {
      expect(posts).toContain('rebuildIndex');
    });

    it('updates category and tag lists', () => {
      expect(posts).toContain('updateCategoryList');
      expect(posts).toContain('updateTagList');
    });

    it('calculates read time', () => {
      expect(posts).toContain('Math.ceil(wordCount / 200)');
    });

    it('returns 409 for duplicate slug', () => {
      expect(posts).toContain('status: 409');
    });

    it('returns 404 for missing post on update', () => {
      expect(posts).toContain('status: 404');
    });

    it('supports status filter on GET', () => {
      expect(posts).toContain("searchParams.get('status')");
    });

    it('supports single post fetch by slug', () => {
      expect(posts).toContain("searchParams.get('slug')");
    });
  });

  describe('Images API (functions/api/images.ts)', () => {
    const images = read('functions/api/images.ts');

    it('exports GET, POST, DELETE handlers', () => {
      expect(images).toContain('export const onRequestGet');
      expect(images).toContain('export const onRequestPost');
      expect(images).toContain('export const onRequestDelete');
    });

    it('authenticates requests', () => {
      expect(images).toContain('authenticate(request');
    });

    it('handles multipart form data upload', () => {
      expect(images).toContain('request.formData()');
    });

    it('validates file type', () => {
      expect(images).toContain('image/jpeg');
      expect(images).toContain('image/png');
      expect(images).toContain('image/webp');
    });

    it('enforces 10MB size limit', () => {
      expect(images).toContain('10 * 1024 * 1024');
    });

    it('sanitizes filename', () => {
      expect(images).toContain("replace(/[^a-zA-Z0-9._-]/g, '-')");
    });

    it('stores in blog/ prefix', () => {
      expect(images).toContain('`blog/${timestamp}-${safeName}`');
    });

    it('uses R2 bucket binding', () => {
      expect(images).toContain('BLOG_IMAGES');
    });

    it('lists images from R2', () => {
      expect(images).toContain('env.BLOG_IMAGES.list()');
    });
  });

  describe('Categories API (functions/api/categories.ts)', () => {
    const cats = read('functions/api/categories.ts');

    it('exports GET, POST, DELETE handlers', () => {
      expect(cats).toContain('export const onRequestGet');
      expect(cats).toContain('export const onRequestPost');
      expect(cats).toContain('export const onRequestDelete');
    });

    it('authenticates requests', () => {
      expect(cats).toContain('authenticate(request');
    });

    it('reads from categories:list KV key', () => {
      expect(cats).toContain("'categories:list'");
    });

    it('prevents duplicates', () => {
      expect(cats).toContain('!cats.includes(trimmed)');
    });

    it('sorts categories alphabetically', () => {
      expect(cats).toContain('cats.sort()');
    });
  });

  describe('Tags API (functions/api/tags.ts)', () => {
    const tags = read('functions/api/tags.ts');

    it('exports GET, POST, DELETE handlers', () => {
      expect(tags).toContain('export const onRequestGet');
      expect(tags).toContain('export const onRequestPost');
      expect(tags).toContain('export const onRequestDelete');
    });

    it('reads from tags:list KV key', () => {
      expect(tags).toContain("'tags:list'");
    });

    it('prevents duplicates', () => {
      expect(tags).toContain('!tags.includes(trimmed)');
    });
  });

  describe('Admin page shell', () => {
    const page = read('src/pages/admin/index.astro');

    it('exists', () => {
      expect(existsSync(resolve(root, 'src/pages/admin/index.astro'))).toBe(true);
    });

    it('is prerendered', () => {
      expect(page).toContain('export const prerender = true');
    });

    it('blocks search engine indexing', () => {
      expect(page).toContain('noindex, nofollow');
    });

    it('has admin-root mount point', () => {
      expect(page).toContain('id="admin-root"');
    });

    it('imports AdminApp component', () => {
      expect(page).toContain('AdminApp');
    });

    it('uses createRoot for React mounting', () => {
      expect(page).toContain('createRoot');
    });

    it('has noscript fallback', () => {
      expect(page).toContain('<noscript>');
    });
  });

  describe('Admin React components exist', () => {
    const components = [
      'src/components/admin/AdminApp.tsx',
      'src/components/admin/Dashboard.tsx',
      'src/components/admin/PostList.tsx',
      'src/components/admin/BlogEditor.tsx',
      'src/components/admin/ImageGallery.tsx',
      'src/components/admin/ManageTaxonomies.tsx',
      'src/components/admin/api.ts',
    ];

    components.forEach((file) => {
      it(`${file} exists`, () => {
        expect(existsSync(resolve(root, file))).toBe(true);
      });
    });
  });

  describe('AdminApp.tsx', () => {
    const app = read('src/components/admin/AdminApp.tsx');

    it('has login form', () => {
      expect(app).toContain('type="password"');
      expect(app).toContain('Sign In');
    });

    it('has sidebar navigation', () => {
      expect(app).toContain('Dashboard');
      expect(app).toContain('Posts');
      expect(app).toContain('Images');
      expect(app).toContain('Categories & Tags');
    });

    it('has logout button', () => {
      expect(app).toContain('Sign Out');
      expect(app).toContain('handleLogout');
    });

    it('has new post button', () => {
      expect(app).toContain('New Post');
    });

    it('renders all view components', () => {
      expect(app).toContain('<Dashboard');
      expect(app).toContain('<PostList');
      expect(app).toContain('<BlogEditor');
      expect(app).toContain('<ImageGallery');
      expect(app).toContain('<ManageTaxonomies');
    });

    it('manages authentication state', () => {
      expect(app).toContain('authenticated');
      expect(app).toContain('getToken');
      expect(app).toContain('clearToken');
    });

    it('shows login error', () => {
      expect(app).toContain('loginError');
      expect(app).toContain("role=\"alert\"");
    });
  });

  describe('Dashboard.tsx', () => {
    const dash = read('src/components/admin/Dashboard.tsx');

    it('shows post statistics', () => {
      expect(dash).toContain('Total Posts');
      expect(dash).toContain('Published');
      expect(dash).toContain('Drafts');
      expect(dash).toContain('Scheduled');
    });

    it('shows recent posts list', () => {
      expect(dash).toContain('Recent Posts');
    });

    it('fetches posts on mount', () => {
      expect(dash).toContain('fetchPosts');
    });

    it('has View All link', () => {
      expect(dash).toContain('View All');
    });
  });

  describe('PostList.tsx', () => {
    const list = read('src/components/admin/PostList.tsx');

    it('has search functionality', () => {
      expect(list).toContain('Search posts');
      expect(list).toContain('search');
    });

    it('has status filter', () => {
      expect(list).toContain('All Status');
      expect(list).toContain('Published');
      expect(list).toContain('Draft');
    });

    it('has delete with confirmation', () => {
      expect(list).toContain('confirm(');
      expect(list).toContain('deletePost');
    });

    it('has edit button', () => {
      expect(list).toContain('onEdit(post.slug)');
    });

    it('has new post button', () => {
      expect(list).toContain('New Post');
    });

    it('shows table with columns', () => {
      expect(list).toContain('Title');
      expect(list).toContain('Category');
      expect(list).toContain('Status');
      expect(list).toContain('Actions');
    });
  });

  describe('BlogEditor.tsx', () => {
    const editor = read('src/components/admin/BlogEditor.tsx');

    it('has title input', () => {
      expect(editor).toContain('Post title');
    });

    it('has slug field with auto-generation', () => {
      expect(editor).toContain('Slug:');
      expect(editor).toContain('slugify');
    });

    it('has markdown content editor', () => {
      expect(editor).toContain('Write your post content in Markdown');
    });

    it('has markdown preview toggle', () => {
      expect(editor).toContain('showPreview');
      expect(editor).toContain('renderMarkdown');
    });

    it('has excerpt field', () => {
      expect(editor).toContain('Excerpt');
      expect(editor).toContain('Auto-generated from content');
    });

    it('has SEO settings section', () => {
      expect(editor).toContain('SEO Settings');
      expect(editor).toContain('SEO Title');
      expect(editor).toContain('SEO Description');
    });

    it('shows character counts for SEO fields', () => {
      expect(editor).toContain('/60 characters');
      expect(editor).toContain('/160 characters');
    });

    it('has category selector with create-new', () => {
      expect(editor).toContain('Select category');
      expect(editor).toContain('New category');
      expect(editor).toContain('handleAddCategory');
    });

    it('has tags management', () => {
      expect(editor).toContain('Add tag');
      expect(editor).toContain('handleAddTag');
      expect(editor).toContain('handleRemoveTag');
    });

    it('has featured image input with preview', () => {
      expect(editor).toContain('Featured Image');
      expect(editor).toContain('Image URL');
    });

    it('has publish controls', () => {
      expect(editor).toContain('Save Draft');
      expect(editor).toContain('Publish');
    });

    it('has status selector with scheduled option', () => {
      expect(editor).toContain('value="draft"');
      expect(editor).toContain('value="published"');
      expect(editor).toContain('value="scheduled"');
    });

    it('shows scheduled date picker when status is scheduled', () => {
      expect(editor).toContain("status === 'scheduled'");
      expect(editor).toContain('datetime-local');
    });

    it('has author field', () => {
      expect(editor).toContain('Author');
      expect(editor).toContain('Dr. Pradnya Chittawadagi');
    });

    it('handles create and update modes', () => {
      expect(editor).toContain('isEditing');
      expect(editor).toContain('createPost');
      expect(editor).toContain('updatePost');
    });

    it('shows success and error messages', () => {
      expect(editor).toContain('Post created!');
      expect(editor).toContain('Post updated!');
      expect(editor).toContain("role=\"alert\"");
    });
  });

  describe('ImageGallery.tsx', () => {
    const gallery = read('src/components/admin/ImageGallery.tsx');

    it('has upload button', () => {
      expect(gallery).toContain('Upload Image');
      expect(gallery).toContain("type=\"file\"");
      expect(gallery).toContain("accept=\"image/*\"");
    });

    it('supports multiple file upload', () => {
      expect(gallery).toContain('multiple');
    });

    it('shows image grid', () => {
      expect(gallery).toContain('grid-cols-2');
      expect(gallery).toContain('md:grid-cols-3');
    });

    it('has copy URL functionality', () => {
      expect(gallery).toContain('Copy URL');
      expect(gallery).toContain('navigator.clipboard.writeText');
    });

    it('has delete with confirmation', () => {
      expect(gallery).toContain("confirm('Delete this image?')");
      expect(gallery).toContain('deleteImage');
    });

    it('shows file metadata', () => {
      expect(gallery).toContain('formatSize');
      expect(gallery).toContain('toLocaleDateString');
    });

    it('has empty state', () => {
      expect(gallery).toContain('No images uploaded yet');
    });
  });

  describe('ManageTaxonomies.tsx', () => {
    const tax = read('src/components/admin/ManageTaxonomies.tsx');

    it('manages categories', () => {
      expect(tax).toContain('Categories');
      expect(tax).toContain('New category name');
      expect(tax).toContain('handleAddCategory');
      expect(tax).toContain('handleRemoveCategory');
    });

    it('manages tags', () => {
      expect(tax).toContain('Tags');
      expect(tax).toContain('New tag name');
      expect(tax).toContain('handleAddTag');
      expect(tax).toContain('handleRemoveTag');
    });

    it('has delete confirmation', () => {
      expect(tax).toContain("confirm(");
    });

    it('shows counts', () => {
      expect(tax).toContain('categories.length');
      expect(tax).toContain('tags.length');
    });
  });

  describe('API client (api.ts)', () => {
    const api = read('src/components/admin/api.ts');

    it('exports login function', () => {
      expect(api).toContain('export async function login');
    });

    it('exports token management functions', () => {
      expect(api).toContain('export function getToken');
      expect(api).toContain('export function setToken');
      expect(api).toContain('export function clearToken');
    });

    it('exports CRUD functions for posts', () => {
      expect(api).toContain('export async function fetchPosts');
      expect(api).toContain('export async function fetchPost');
      expect(api).toContain('export async function createPost');
      expect(api).toContain('export async function updatePost');
      expect(api).toContain('export async function deletePost');
    });

    it('exports category management functions', () => {
      expect(api).toContain('export async function fetchCategories');
      expect(api).toContain('export async function addCategory');
      expect(api).toContain('export async function removeCategory');
    });

    it('exports tag management functions', () => {
      expect(api).toContain('export async function fetchTags');
      expect(api).toContain('export async function addTag');
      expect(api).toContain('export async function removeTag');
    });

    it('exports image management functions', () => {
      expect(api).toContain('export async function fetchImages');
      expect(api).toContain('export async function uploadImage');
      expect(api).toContain('export async function deleteImage');
    });

    it('uses localStorage for token storage', () => {
      expect(api).toContain('localStorage.getItem');
      expect(api).toContain('localStorage.setItem');
      expect(api).toContain('localStorage.removeItem');
    });

    it('includes Bearer token in auth headers', () => {
      expect(api).toContain('`Bearer ${token}`');
    });

    it('handles session expiry', () => {
      expect(api).toContain('Session expired');
    });

    it('uses FormData for image uploads', () => {
      expect(api).toContain('new FormData()');
    });
  });
});
