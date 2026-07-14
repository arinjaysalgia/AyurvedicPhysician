import { useState, useEffect } from 'react';
import { getToken, clearToken, login as apiLogin } from './api';
import Dashboard from './Dashboard';
import PostList from './PostList';
import BlogEditor from './BlogEditor';
import ImageGallery from './ImageGallery';
import ManageTaxonomies from './ManageTaxonomies';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Image,
  Tags,
  LogOut,
} from 'lucide-react';

type View = 'dashboard' | 'posts' | 'editor' | 'images' | 'taxonomies';

export default function AdminApp() {
  const [authenticated, setAuthenticated] = useState(false);
  const [view, setView] = useState<View>('dashboard');
  const [editSlug, setEditSlug] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    if (getToken()) setAuthenticated(true);
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError('');
    try {
      await apiLogin(password);
      setAuthenticated(true);
    } catch (err: any) {
      setLoginError(err.message);
    } finally {
      setLoggingIn(false);
    }
  }

  function handleLogout() {
    clearToken();
    setAuthenticated(false);
    setPassword('');
  }

  function handleEditPost(slug: string) {
    setEditSlug(slug);
    setView('editor');
  }

  function handleNewPost() {
    setEditSlug(null);
    setView('editor');
  }

  function handleEditorDone() {
    setEditSlug(null);
    setView('posts');
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-amber-50 p-4">
        <form
          onSubmit={handleLogin}
          className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm"
        >
          <div className="text-center mb-6">
            <span className="text-4xl">🌿</span>
            <h1 className="text-2xl font-bold text-gray-900 mt-2">Admin Login</h1>
            <p className="text-gray-500 text-sm mt-1">Dr. Pradnya&apos;s Blog</p>
          </div>
          {loginError && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg" role="alert">
              {loginError}
            </div>
          )}
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none mb-4"
            placeholder="Enter admin password"
            autoFocus
          />
          <button
            type="submit"
            disabled={loggingIn || !password}
            className="w-full py-2.5 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 disabled:opacity-50 transition-colors"
          >
            {loggingIn ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    );
  }

  const navItems: { key: View; label: string; icon: typeof LayoutDashboard }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'posts', label: 'Posts', icon: FileText },
    { key: 'images', label: 'Images', icon: Image },
    { key: 'taxonomies', label: 'Categories & Tags', icon: Tags },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-gray-900 text-white flex flex-col shrink-0">
        <div className="p-5 border-b border-gray-700">
          <span className="text-lg font-bold">🌿 Blog Admin</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                view === key
                  ? 'bg-green-700 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
          <button
            onClick={handleNewPost}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <PlusCircle size={18} />
            New Post
          </button>
        </nav>
        <div className="p-3 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-red-400 transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-6 max-w-6xl mx-auto">
          {view === 'dashboard' && (
            <Dashboard onNavigate={setView} onEditPost={handleEditPost} />
          )}
          {view === 'posts' && (
            <PostList onEdit={handleEditPost} onNew={handleNewPost} />
          )}
          {view === 'editor' && (
            <BlogEditor slug={editSlug} onDone={handleEditorDone} />
          )}
          {view === 'images' && <ImageGallery />}
          {view === 'taxonomies' && <ManageTaxonomies />}
        </div>
      </main>
    </div>
  );
}
