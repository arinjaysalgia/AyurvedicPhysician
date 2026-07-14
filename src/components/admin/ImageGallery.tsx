import { useState, useEffect, useRef } from 'react';
import { fetchImages, uploadImage, deleteImage } from './api';
import { Upload, Trash2, Copy, Check, Loader2, ImageIcon } from 'lucide-react';

interface ImageItem {
  key: string;
  size: number;
  uploaded: string;
  url: string;
}

export default function ImageGallery() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadImages();
  }, []);

  async function loadImages() {
    setLoading(true);
    try {
      const data = await fetchImages();
      setImages(data);
    } catch {
      setImages([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        await uploadImage(file);
      }
      await loadImages();
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  async function handleDelete(key: string) {
    if (!confirm('Delete this image?')) return;
    setDeleting(key);
    try {
      await deleteImage(key);
      setImages((prev) => prev.filter((img) => img.key !== key));
    } catch {
      alert('Failed to delete image.');
    } finally {
      setDeleting(null);
    }
  }

  function handleCopyUrl(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  }

  function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Images</h1>
        <label className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800 transition-colors cursor-pointer">
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          {uploading ? 'Uploading...' : 'Upload Image'}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {loading ? (
        <p className="text-gray-500 py-12 text-center">Loading images...</p>
      ) : images.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <ImageIcon size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No images uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div
              key={img.key}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden group"
            >
              <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                <img
                  src={img.url}
                  alt={img.key.split('/').pop() || ''}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-3">
                <p className="text-xs text-gray-700 font-medium truncate" title={img.key}>
                  {img.key.split('/').pop()}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {formatSize(img.size)} · {new Date(img.uploaded).toLocaleDateString()}
                </p>
                <div className="flex gap-1.5 mt-2">
                  <button
                    onClick={() => handleCopyUrl(img.url)}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs hover:bg-gray-200 transition-colors"
                  >
                    {copied === img.url ? <Check size={12} /> : <Copy size={12} />}
                    {copied === img.url ? 'Copied' : 'Copy URL'}
                  </button>
                  <button
                    onClick={() => handleDelete(img.key)}
                    disabled={deleting === img.key}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
