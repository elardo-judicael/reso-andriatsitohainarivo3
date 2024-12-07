import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { updateDoc, doc, arrayUnion, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
    uid: string;
  };
  content: string;
  createdAt: Timestamp;
}

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
}

export function CommentSection({ postId, comments }: CommentSectionProps) {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const comment = {
        id: crypto.randomUUID(),
        author: {
          name: user.displayName || 'Anonymous',
          avatar: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'Anonymous')}`,
          uid: user.uid
        },
        content: newComment.trim(),
        createdAt: Timestamp.now()
      };

      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        comments: arrayUnion(comment)
      });

      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4 border-t border-gray-100 pt-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex items-start space-x-3 mb-4">
          <img
            src={comment.author.avatar}
            alt={comment.author.name}
            className="h-8 w-8 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="bg-gray-50 rounded-lg px-4 py-2">
              <p className="font-medium text-sm text-gray-900">{comment.author.name}</p>
              <p className="text-sm text-gray-700">{comment.content}</p>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {comment.createdAt.toDate().toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}

      {user && (
        <form onSubmit={handleSubmitComment} className="mt-4 flex items-start space-x-3">
          <img
            src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}`}
            alt={user.displayName || 'User'}
            className="h-8 w-8 rounded-full object-cover"
          />
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              rows={2}
            />
            <button
              type="submit"
              disabled={!newComment.trim() || isSubmitting}
              className="mt-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}