import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import {
  calculateReadTime,
  generateExcerpt,
  slugify,
} from '../src/data/blog-types';
import { renderMarkdown } from '../src/data/markdown';

const root = resolve(__dirname, '..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf-8');

describe('Phase 9: Blog Public Pages', () => {
  describe('Blog type definitions and utilities', () => {
    it('blog-types.ts exists', () => {
      expect(existsSync(resolve(root, 'src/data/blog-types.ts'))).toBe(true);
    });

    it('blog-kv.ts exists', () => {
      expect(existsSync(resolve(root, 'src/data/blog-kv.ts'))).toBe(true);
    });

    it('markdown.ts exists', () => {
      expect(existsSync(resolve(root, 'src/data/markdown.ts'))).toBe(true);
    });

    describe('calculateReadTime', () => {
      it('returns 1 for short content', () => {
        expect(calculateReadTime('hello world')).toBe(1);
      });

      it('calculates ~200 words per minute', () => {
        const words = Array(400).fill('word').join(' ');
        expect(calculateReadTime(words)).toBe(2);
      });

      it('rounds up', () => {
        const words = Array(250).fill('word').join(' ');
        expect(calculateReadTime(words)).toBe(2);
      });
    });

    describe('generateExcerpt', () => {
      it('returns short content as-is', () => {
        expect(generateExcerpt('Short text')).toBe('Short text');
      });

      it('truncates long content with ellipsis', () => {
        const long = 'word '.repeat(100);
        const excerpt = generateExcerpt(long, 50);
        expect(excerpt.length).toBeLessThanOrEqual(54);
        expect(excerpt).toContain('...');
      });

      it('strips markdown syntax', () => {
        const md = '**bold** and *italic* and [link](url)';
        const excerpt = generateExcerpt(md);
        expect(excerpt).not.toContain('**');
        expect(excerpt).not.toContain('*');
      });
    });

    describe('slugify', () => {
      it('converts to lowercase', () => {
        expect(slugify('Hello World')).toBe('hello-world');
      });

      it('replaces spaces with hyphens', () => {
        expect(slugify('foo bar baz')).toBe('foo-bar-baz');
      });

      it('removes special characters', () => {
        expect(slugify('Hello! @World#')).toBe('hello-world');
      });

      it('collapses multiple hyphens', () => {
        expect(slugify('foo---bar')).toBe('foo-bar');
      });
    });
  });

  describe('Markdown renderer', () => {
    it('renders headings', () => {
      expect(renderMarkdown('# Title')).toContain('<h1>Title</h1>');
      expect(renderMarkdown('## Subtitle')).toContain('<h2>Subtitle</h2>');
      expect(renderMarkdown('### H3')).toContain('<h3>H3</h3>');
    });

    it('renders bold text', () => {
      expect(renderMarkdown('**bold**')).toContain('<strong>bold</strong>');
    });

    it('renders italic text', () => {
      expect(renderMarkdown('*italic*')).toContain('<em>italic</em>');
    });

    it('renders inline code', () => {
      expect(renderMarkdown('`code`')).toContain('<code>code</code>');
    });

    it('renders blockquotes', () => {
      expect(renderMarkdown('> quote')).toContain('<blockquote>quote</blockquote>');
    });

    it('renders links', () => {
      const result = renderMarkdown('[text](https://example.com)');
      expect(result).toContain('href="https://example.com"');
      expect(result).toContain('text');
    });

    it('renders images', () => {
      const result = renderMarkdown('![alt](image.jpg)');
      expect(result).toContain('<img');
      expect(result).toContain('alt="alt"');
      expect(result).toContain('src="image.jpg"');
    });

    it('renders horizontal rules', () => {
      expect(renderMarkdown('---')).toContain('<hr />');
    });

    it('wraps plain text in paragraphs', () => {
      expect(renderMarkdown('Hello world')).toContain('<p>Hello world</p>');
    });
  });

  describe('Blog KV helpers', () => {
    const kvHelpers = read('src/data/blog-kv.ts');

    it('exports getPost function', () => {
      expect(kvHelpers).toContain('export async function getPost');
    });

    it('exports getPublishedPosts function', () => {
      expect(kvHelpers).toContain('export async function getPublishedPosts');
    });

    it('exports getPublishedPostsByCategory function', () => {
      expect(kvHelpers).toContain('export async function getPublishedPostsByCategory');
    });

    it('exports getCategories function', () => {
      expect(kvHelpers).toContain('export async function getCategories');
    });

    it('exports getTags function', () => {
      expect(kvHelpers).toContain('export async function getTags');
    });

    it('exports getRelatedPosts function', () => {
      expect(kvHelpers).toContain('export async function getRelatedPosts');
    });

    it('uses post: prefix for KV keys', () => {
      expect(kvHelpers).toContain('`post:${slug}`');
    });

    it('uses posts:index for listing', () => {
      expect(kvHelpers).toContain("'posts:index'");
    });

    it('sorts posts by date descending', () => {
      expect(kvHelpers).toContain('b.publishDate');
    });

    it('filters related posts by category', () => {
      expect(kvHelpers).toContain('p.category === category');
    });

    it('excludes current post from related', () => {
      expect(kvHelpers).toContain('p.slug !== currentSlug');
    });
  });

  describe('Blog components exist', () => {
    const components = [
      'src/components/blog/BlogCard.astro',
      'src/components/blog/BlogPost.astro',
      'src/components/blog/CategoryFilter.astro',
      'src/components/blog/Pagination.astro',
      'src/components/blog/RelatedPosts.astro',
    ];

    components.forEach((file) => {
      it(`${file} exists`, () => {
        expect(existsSync(resolve(root, file))).toBe(true);
      });
    });
  });

  describe('BlogCard.astro', () => {
    const card = read('src/components/blog/BlogCard.astro');

    it('links to /blog/[slug]', () => {
      expect(card).toContain('/blog/${post.slug}');
    });

    it('shows featured image', () => {
      expect(card).toContain('featuredImage');
    });

    it('shows category badge', () => {
      expect(card).toContain('post.category');
    });

    it('shows read time', () => {
      expect(card).toContain('readTime');
    });

    it('shows formatted date', () => {
      expect(card).toContain('formattedDate');
    });

    it('has lazy loading for image', () => {
      expect(card).toContain('loading="lazy"');
    });

    it('has hover effects', () => {
      expect(card).toContain('hover:shadow-lg');
      expect(card).toContain('group-hover:scale-105');
    });

    it('truncates excerpt', () => {
      expect(card).toContain('line-clamp-3');
    });
  });

  describe('BlogPost.astro', () => {
    const post = read('src/components/blog/BlogPost.astro');

    it('imports renderMarkdown', () => {
      expect(post).toContain("from '../../data/markdown'");
    });

    it('renders markdown content with set:html', () => {
      expect(post).toContain('set:html={renderedContent}');
    });

    it('shows author, date, read time', () => {
      expect(post).toContain('post.author');
      expect(post).toContain('formattedDate');
      expect(post).toContain('readTime');
    });

    it('shows tags', () => {
      expect(post).toContain('post.tags');
    });

    it('has prose styling for content', () => {
      expect(post).toContain('prose');
    });

    it('has eager loading for featured image', () => {
      expect(post).toContain('loading="eager"');
    });
  });

  describe('CategoryFilter.astro', () => {
    const filter = read('src/components/blog/CategoryFilter.astro');

    it('has All Posts link', () => {
      expect(filter).toContain('All Posts');
    });

    it('links to /blog with category param', () => {
      expect(filter).toContain('/blog?category=');
    });

    it('highlights active category', () => {
      expect(filter).toContain('activeCategory === cat');
    });
  });

  describe('Pagination.astro', () => {
    const pagination = read('src/components/blog/Pagination.astro');

    it('has Previous/Next links', () => {
      expect(pagination).toContain('Previous');
      expect(pagination).toContain('Next');
    });

    it('has aria-current for current page', () => {
      expect(pagination).toContain("aria-current");
    });

    it('has pagination aria-label', () => {
      expect(pagination).toContain('aria-label="Blog pagination"');
    });

    it('only shows when totalPages > 1', () => {
      expect(pagination).toContain('totalPages > 1');
    });
  });

  describe('RelatedPosts.astro', () => {
    const related = read('src/components/blog/RelatedPosts.astro');

    it('uses BlogCard component', () => {
      expect(related).toContain('BlogCard');
    });

    it('has Related Articles heading', () => {
      expect(related).toContain('Related Articles');
    });

    it('only renders when posts exist', () => {
      expect(related).toContain('posts.length > 0');
    });

    it('uses 3-column grid', () => {
      expect(related).toContain('md:grid-cols-3');
    });
  });

  describe('Blog listing page (blog/index.astro)', () => {
    const page = read('src/pages/blog/index.astro');

    it('is server-rendered (prerender = false)', () => {
      expect(page).toContain('export const prerender = false');
    });

    it('imports KV helpers', () => {
      expect(page).toContain("from '../../data/blog-kv'");
    });

    it('reads BLOG_KV from cloudflare env', () => {
      expect(page).toContain('BLOG_KV');
    });

    it('supports category filter via query param', () => {
      expect(page).toContain("searchParams.get('category')");
    });

    it('supports pagination via query param', () => {
      expect(page).toContain("searchParams.get('page')");
    });

    it('uses POSTS_PER_PAGE constant', () => {
      expect(page).toContain('POSTS_PER_PAGE');
    });

    it('renders BlogCard for each post', () => {
      expect(page).toContain('<BlogCard');
    });

    it('shows empty state when no posts', () => {
      expect(page).toContain('No blog posts yet');
    });

    it('renders CategoryFilter', () => {
      expect(page).toContain('<CategoryFilter');
    });

    it('renders Pagination', () => {
      expect(page).toContain('<Pagination');
    });
  });

  describe('Blog post page (blog/[slug].astro)', () => {
    const page = read('src/pages/blog/[slug].astro');

    it('is server-rendered (prerender = false)', () => {
      expect(page).toContain('export const prerender = false');
    });

    it('reads slug from params', () => {
      expect(page).toContain('Astro.params');
    });

    it('fetches post from KV', () => {
      expect(page).toContain('getPost(kv, slug)');
    });

    it('redirects to /blog if not found', () => {
      expect(page).toContain("Astro.redirect('/blog')");
    });

    it('only shows published posts', () => {
      expect(page).toContain("post.status !== 'published'");
    });

    it('fetches related posts', () => {
      expect(page).toContain('getRelatedPosts');
    });

    it('has Article JSON-LD schema', () => {
      expect(page).toContain("'@type': 'Article'");
    });

    it('uses custom SEO title/description if set', () => {
      expect(page).toContain('post.seoTitle || post.title');
      expect(page).toContain('post.seoDescription || post.excerpt');
    });

    it('renders BlogPost component', () => {
      expect(page).toContain('<BlogPostComponent');
    });

    it('renders RelatedPosts', () => {
      expect(page).toContain('<RelatedPosts');
    });
  });
});
