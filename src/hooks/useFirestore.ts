import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
    uid: string;
  };
  content: string;
  createdAt: Timestamp;
}

export interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    username: string;
  };
  content: string;
  image?: string;
  likes: string[];
  comments: Comment[];
  shares: number;
  createdAt: Timestamp;
}

export function useFirestore(collectionName: string) {
  const [documents, setDocuments] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          likes: doc.data().likes || [],
          comments: doc.data().comments || []
        })) as Post[];
        setDocuments(docs);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching documents:', err);
        setError('Failed to fetch posts');
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [collectionName]);

  const addDocument = async (data: Omit<Post, 'id' | 'createdAt' | 'likes' | 'comments'>) => {
    try {
      await addDoc(collection(db, collectionName), {
        ...data,
        likes: [],
        comments: [],
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error('Error adding document:', err);
      throw new Error('Failed to create post');
    }
  };

  return { documents, loading, error, addDocument };
}