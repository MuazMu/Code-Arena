'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth'; // Import User type from Firebase
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';

// Define a type for the user state
interface AppUser extends User {
  // Add any additional fields you expect from Firestore
  [key: string]: any;
}

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null); // Properly type the user state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get additional user data from Firestore
        const unsubscribeDoc = onSnapshot(
          doc(db, 'users', firebaseUser.uid),
          (doc) => {
            if (doc.exists()) {
              // Combine Firebase user data with Firestore data
              setUser({
                ...firebaseUser,
                ...doc.data()
              } as AppUser); // Cast to AppUser type
            }
            setLoading(false);
          }
        );

        return () => unsubscribeDoc();
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return { user, loading };
}