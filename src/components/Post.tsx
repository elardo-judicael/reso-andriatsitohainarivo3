import { useState } from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { CommentSection } from './CommentSection';
import { updateDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface Author {
  name: string;
  avatar: string;
  username: string;
}

interface PostProps {
  id: string;
  author: Author;
  content: string;
  image?: string;
  likes: string[];
  comments: Comment[];
  shares: number;
  timeAgo?: string;
}

export function Post({ id, author, content, image, likes = [], comments = [], shares, timeAgo }: PostProps) {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  
  const isLiked = user ? likes.includes(user.uid) : false;
  
  const handleLike = async () => {
    if (!user || isLiking) return;
    
    setIsLiking(true);
    try {
      const postRef = doc(db, 'posts', id);
      await updateDoc(postRef, {
        likes: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid)
      });
    } catch (error) {
      console.error('Error updating like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center">
          <img
            src={author.avatar}
            alt={author.name}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="ml-3">
            <h3 className="font-semibold text-gray-900">{author.name}</h3>
            <p className="text-sm text-gray-500">{author.username} · {timeAgo}</p>
          </div>
        </div>
        
        <p className="mt-4 text-gray-800">{content}</p>
        
        {image && (
          <img
            src={image}
            alt="Post content"
            className="mt-4 rounded-lg w-full object-cover max-h-96"
          />
        )}

        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
          <button 
            className={`flex items-center transition-colors ${
              isLiked ? 'text-pink-500' : 'text-gray-500 hover:text-pink-500'
            }`}
            onClick={handleLike}
            disabled={!user || isLiking}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
            <span className="ml-2">{likes.length}</span>
          </button>
          
          <button 
            className="flex items-center text-gray-500 hover:text-blue-500 transition-colors"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="h-5 w-5" />
            <span className="ml-2">{comments.length}</span>
          </button>
          
          <button className="flex items-center text-gray-500 hover:text-green-500 transition-colors">
            <Share2 className="h-5 w-5" />
            <span className="ml-2">{shares}</span>
          </button>
        </div>

        {showComments && (
          <CommentSection postId={id} comments={comments} />
        )}
      </div>
    </article>
  );
}