import { useState } from 'react';
import { Post } from './Post';
import { useFirestore } from '../hooks/useFirestore';
import { useAuth } from '../contexts/AuthContext';

export function Feed() {
  const [newPost, setNewPost] = useState('');
  const { documents: posts, loading, error, addDocument } = useFirestore('posts');
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim() || !user) return;

    try {
      await addDocument({
        author: {
          name: user.displayName || 'Anonymous',
          avatar: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'Anonymous')}`,
          username: user.email?.split('@')[0] || '@anonymous'
        },
        content: newPost,
        shares: 0
      });
      setNewPost('');
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto pt-20 px-4">
        <div className="animate-pulse space-y-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/6 mt-2"></div>
                </div>
              </div>
              <div className="mt-4 h-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto pt-20 px-4">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pt-20 px-4">
      <form onSubmit={handleSubmit} className="mb-8">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-4 rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500 resize-none"
          rows={3}
        />
        <div className="flex justify-end mt-2">
          <button 
            type="submit"
            disabled={!newPost.trim()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Post
          </button>
        </div>
      </form>

      <div className="space-y-6">
        {posts.map((post) => (
          <Post 
            key={post.id} 
            {...post}
            likes={post.likes || []}
            comments={post.comments || []}
            timeAgo={post.createdAt ? new Date(post.createdAt.seconds * 1000).toLocaleDateString() : undefined}
          />
        ))}
      </div>
    </div>
  );
}