import { useState, useEffect } from 'react';
import { fetchPost, createPost, updatePost, fetchCategories, fetchTags, addCategory, addTag } from './api';
import { renderMarkdown } from '../../data/markdown';
import { Save, Eye, EyeOff, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

interface Props {
  slug: string | null;
  onDone: () => void;
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

export default function BlogEditor({ slug, onDone }: Props) {
  const [title, setTitle] = useState('');
  const [postSlug, setPostSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [author, setAuthor] = useState('Dr. Pradnya Chittawadagi');
  const [status, setStatus] = useState<'draft' | 'published' | 'scheduled'>('draft');
  const [publishDate, setPublishDate] = useState(new Date().toISOString().slice(0, 16));
  const [scheduledDate, setScheduledDate] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  const [categories, setCategories] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showSeo, setShowSeo] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!slug);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const isEditing = !!slug;

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
    fetchTags().then(setAllTags).catch(() => {});
  }, []);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchPost(slug)
      .then((post: any) => {
        setTitle(post.title);
        setPostSlug(post.slug);
        setContent(post.content);
        setExcerpt(post.excerpt || '');
        setFeaturedImage(post.featuredImage || '');
        setCategory(post.category || '');
        setTags(post.tags || []);
        setAuthor(post.author || 'Dr. Pradnya Chittawadagi');
        setStatus(post.status);
        setPublishDate(post.publishDate?.slice(0, 16) || '');
        setScheduledDate(post.scheduledDate?.slice(0, 16) || '');
        setSeoTitle(post.seoTitle || '');
        setSeoDescription(post.seoDescription || '');
      })
      .catch(() => setError('Failed to load post.'))
      .finally(() => setLoading(false));
  }, [slug]);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!isEditing) setPostSlug(slugify(value));
  }

  function handleAddTag() {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
      if (!allTags.includes(t)) addTag(t).then(setAllTags).catch(() => {});
    }
    setTagInput('');
  }

  function handleRemoveTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  async function handleAddCategory() {
    const c = newCategory.trim();
    if (!c) return;
    try {
      const updated = await addCategory(c);
      setCategories(updated);
      setCategory(c);
      setNewCategory('');
    } catch {}
  }

  async function handleSave(targetStatus?: 'draft' | 'published' | 'scheduled') {
    setError('');
    setSuccess('');
    if (!title.trim()) { setError('Title is required.'); return; }
    if (!postSlug.trim()) { setError('Slug is required.'); return; }
    if (!content.trim()) { setError('Content is required.'); return; }

    setSaving(true);
    const finalStatus = targetStatus || status;
    const data = {
      title: title.trim(),
      slug: postSlug.trim(),
      content,
      excerpt: excerpt || undefined,
      featuredImage,
      category: category || 'Uncategorized',
      tags,
      author,
      status: finalStatus,
      publishDate: finalStatus === 'published' ? new Date().toISOString() : publishDate ? new Date(publishDate).toISOString() : undefined,
      scheduledDate: finalStatus === 'scheduled' && scheduledDate ? new Date(scheduledDate).toISOString() : undefined,
      seoTitle: seoTitle || undefined,
      seoDescription: seoDescription || undefined,
    };

    try {
      if (isEditing) {
        await updatePost(data);
        setSuccess('Post updated!');
      } else {
        await createPost(data);
        setSuccess('Post created!');
        setTimeout(onDone, 1000);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-gray-500 py-12 text-center">Loading post...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Post' : 'New Post'}
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
            {showPreview ? 'Edit' : 'Preview'}
          </button>
          <button
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Publish
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg" role="alert">{error}</div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg">{success}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Post title..."
            className="w-full px-4 py-3 text-xl font-bold border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
          />

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Slug:</span>
            <input
              type="text"
              value={postSlug}
              onChange={(e) => setPostSlug(slugify(e.target.value))}
              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {showPreview ? (
            <div
              className="min-h-96 bg-white border border-gray-300 rounded-xl p-6 prose max-w-none"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
            />
          ) : (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post content in Markdown..."
              rows={20}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl font-mono text-sm resize-y focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Auto-generated from content if left blank..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none resize-none"
            />
          </div>

          <div>
            <button
              onClick={() => setShowSeo(!showSeo)}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              {showSeo ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              SEO Settings
            </button>
            {showSeo && (
              <div className="mt-3 space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">SEO Title</label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder={title || 'Custom search engine title...'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">{(seoTitle || title).length}/60 characters</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">SEO Description</label>
                  <textarea
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder="Custom meta description..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-green-500 outline-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">{seoDescription.length}/160 characters</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Publish Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
              {status === 'scheduled' && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Schedule For</label>
                  <input
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Author</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Category</h3>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none mb-2"
            >
              <option value="">Select category...</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="New category..."
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-green-500 outline-none"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
              />
              <button
                onClick={handleAddCategory}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Tags</h3>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add tag..."
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-green-500 outline-none"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                list="tag-suggestions"
              />
              <datalist id="tag-suggestions">
                {allTags.filter((t) => !tags.includes(t)).map((t) => (
                  <option key={t} value={t} />
                ))}
              </datalist>
              <button
                onClick={handleAddTag}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Featured Image</h3>
            <input
              type="text"
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              placeholder="Image URL..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
            />
            {featuredImage && (
              <img
                src={featuredImage}
                alt="Featured"
                className="mt-2 w-full h-32 object-cover rounded-lg"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
