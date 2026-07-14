import { useState, useEffect } from 'react';
import {
  fetchCategories, addCategory, removeCategory,
  fetchTags, addTag, removeTag,
} from './api';
import { Plus, X, FolderOpen, Tag } from 'lucide-react';

export default function ManageTaxonomies() {
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchCategories(), fetchTags()])
      .then(([cats, tgs]) => { setCategories(cats); setTags(tgs); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCategory.trim()) return;
    try {
      const updated = await addCategory(newCategory.trim());
      setCategories(updated);
      setNewCategory('');
    } catch {}
  }

  async function handleRemoveCategory(cat: string) {
    if (!confirm(`Remove category "${cat}"? Existing posts won't be affected.`)) return;
    try {
      const updated = await removeCategory(cat);
      setCategories(updated);
    } catch {}
  }

  async function handleAddTag(e: React.FormEvent) {
    e.preventDefault();
    if (!newTag.trim()) return;
    try {
      const updated = await addTag(newTag.trim());
      setTags(updated);
      setNewTag('');
    } catch {}
  }

  async function handleRemoveTag(tag: string) {
    if (!confirm(`Remove tag "${tag}"? Existing posts won't be affected.`)) return;
    try {
      const updated = await removeTag(tag);
      setTags(updated);
    } catch {}
  }

  if (loading) {
    return <p className="text-gray-500 py-12 text-center">Loading...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Categories & Tags</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <FolderOpen size={20} className="text-green-700" />
            <h2 className="font-semibold text-gray-900">Categories</h2>
            <span className="text-xs text-gray-400 ml-auto">{categories.length}</span>
          </div>

          <form onSubmit={handleAddCategory} className="flex gap-2 mb-4">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category name..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
            />
            <button
              type="submit"
              disabled={!newCategory.trim()}
              className="flex items-center gap-1 px-3 py-2 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800 disabled:opacity-50 transition-colors"
            >
              <Plus size={14} /> Add
            </button>
          </form>

          {categories.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">No categories yet.</p>
          ) : (
            <ul className="space-y-1.5">
              {categories.map((cat) => (
                <li
                  key={cat}
                  className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm text-gray-700">{cat}</span>
                  <button
                    onClick={() => handleRemoveCategory(cat)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    title="Remove"
                  >
                    <X size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Tag size={20} className="text-amber-600" />
            <h2 className="font-semibold text-gray-900">Tags</h2>
            <span className="text-xs text-gray-400 ml-auto">{tags.length}</span>
          </div>

          <form onSubmit={handleAddTag} className="flex gap-2 mb-4">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="New tag name..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
            />
            <button
              type="submit"
              disabled={!newTag.trim()}
              className="flex items-center gap-1 px-3 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 disabled:opacity-50 transition-colors"
            >
              <Plus size={14} /> Add
            </button>
          </form>

          {tags.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">No tags yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-800 text-sm rounded-full"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="text-amber-400 hover:text-red-500 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
