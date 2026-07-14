import { useState, useEffect } from 'react';
import { fetchPosts } from './api';
import { FileText, Eye, PenLine, Clock } from 'lucide-react';

interface Props {
  onNavigate: (view: string) => void;
  onEditPost: (slug: string) => void;
}

export default function Dashboard({ onNavigate, onEditPost }: Props) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts()
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const published = posts.filter((p) => p.status === 'published');
  const drafts = posts.filter((p) => p.status === 'draft');
  const scheduled = posts.filter((p) => p.status === 'scheduled');

  const stats = [
    { label: 'Total Posts', value: posts.length, icon: FileText, color: 'bg-blue-100 text-blue-700' },
    { label: 'Published', value: published.length, icon: Eye, color: 'bg-green-100 text-green-700' },
    { label: 'Drafts', value: drafts.length, icon: PenLine, color: 'bg-amber-100 text-amber-700' },
    { label: 'Scheduled', value: scheduled.length, icon: Clock, color: 'bg-purple-100 text-purple-700' },
  ];

  if (loading) {
    return <p className="text-gray-500 py-12 text-center">Loading dashboard...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl p-5 border border-gray-200">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color} mb-3`}>
              <Icon size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-semibold text-gray-900">Recent Posts</h2>
          <button
            onClick={() => onNavigate('posts')}
            className="text-sm text-green-700 hover:text-green-800 font-medium"
          >
            View All →
          </button>
        </div>
        {posts.length === 0 ? (
          <p className="p-5 text-gray-500 text-center">No posts yet. Create your first post!</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {posts.slice(0, 5).map((post) => (
              <li key={post.slug} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50">
                <div>
                  <button
                    onClick={() => onEditPost(post.slug)}
                    className="font-medium text-gray-900 hover:text-green-700 text-left"
                  >
                    {post.title}
                  </button>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {post.category} · {new Date(post.publishDate).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    post.status === 'published'
                      ? 'bg-green-100 text-green-700'
                      : post.status === 'scheduled'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {post.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
