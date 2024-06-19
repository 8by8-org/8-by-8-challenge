'use client';
import { useState, useRef, useEffect, type PropsWithChildren } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailLink,
  signOut as signOutFromFirebase,
  connectAuthEmulator,
  type Unsubscribe,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  onSnapshot,
  connectFirestoreEmulator,
} from 'firebase/firestore';
import { z } from 'zod';
import {
  UserContext,
  type SignUpWithEmailParams,
  type SignInWithEmailParams,
} from './user-context';
import { LoadingWheel } from '@/components/utils/loading-wheel';
import type { User } from '@/model/types/user';

const firebaseConfig = {
  apiKey: z
    .string()
    .min(
      1,
      'FirebaseUserContextProvider could not read Firebase api key from .env.',
    )
    .parse(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
  authDomain: z
    .string()
    .min(
      1,
      'FirebaseUserContextProvider could not read Firebase auth domain from .env.',
    )
    .parse(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
  projectId: z
    .string()
    .min(
      1,
      'FirebaseUserContextProvider could not read Firebase project id from .env.',
    )
    .parse(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
  appId: z
    .string()
    .min(
      1,
      'FirebaseUserContextProvider could not read Firebase app id from .env.',
    )
    .parse(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
if (process.env.NODE_ENV === 'development') {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099');
}

const db = getFirestore(app);
if (process.env.NODE_ENV === 'development') {
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
}

export function FirebaseUserContextProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const unsubFromAuthStateChanges = useRef<Unsubscribe | null>();
  const unsubFromSnapshotListener = useRef<Unsubscribe | null>();

  useEffect(() => {
    unsubFromAuthStateChanges.current = auth.onAuthStateChanged(
      async principal => {
        unsubFromSnapshotListener.current &&
          unsubFromSnapshotListener.current();

        if (principal) {
          setIsLoading(true);

          const users = collection(db, 'users');
          const userDocRef = doc(users, principal.uid);
          const userDoc = await getDoc(userDocRef);

          setUser(userDoc.data() as User);

          unsubFromSnapshotListener.current = onSnapshot(
            userDocRef,
            snapshot => {
              setUser(snapshot.data() as User);
            },
          );

          setIsLoading(false);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      },
    );

    return () => {
      unsubFromAuthStateChanges.current && unsubFromAuthStateChanges.current();
      unsubFromSnapshotListener.current && unsubFromSnapshotListener.current();
    };
  }, []);

  const signUpWithEmail = async (params: SignUpWithEmailParams) => {
    const response = await fetch('/api/signup-with-email', {
      method: 'POST',
      body: JSON.stringify(params),
    });

    if (response.ok) {
      console.log('ok!');
      await signInWithEmailLink(
        auth,
        params.email,
        'http://localhost:3000/progress',
      );
    } else {
      throw new Error('There was a problem creating the user.');
    }
  };

  const signInWithEmail = async ({
    email,
    captchaToken,
  }: SignInWithEmailParams) => {
    const response = await fetch('/api/verify-captcha-token', {
      method: 'POST',
      body: JSON.stringify({ captchaToken }),
    });

    if (response.ok) {
      await signInWithEmailLink(auth, email);
    } else {
      throw new Error('There was a problem signing in.');
    }
  };

  const signOut = () => {
    signOutFromFirebase(auth);
  };

  const restartChallenge = () => {
    throw new Error('Not implemented.');
  };

  return (
    <UserContext.Provider
      value={{
        user,
        signUpWithEmail,
        signInWithEmail,
        signOut,
        restartChallenge,
      }}
    >
      {children}
      {isLoading && <LoadingWheel />}
    </UserContext.Provider>
  );
}
