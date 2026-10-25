import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';

export interface UserProfile {
  uid: string;
  fullName: string;
  nim?: string;
  email: string;
  role: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  registerWithEmail: (email: string, pass: string, fullName: string, nim: string) => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync profile from Firestore
  const loadProfile = async (firebaseUser: User) => {
    const path = `users/${firebaseUser.uid}`;
    try {
      const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (snap.exists()) {
        setUserProfile(snap.data() as UserProfile);
      } else {
        const fallbackProfile: UserProfile = {
          uid: firebaseUser.uid,
          fullName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Mahasiswa APSI',
          nim: '-',
          email: firebaseUser.email || '',
          role: 'Mahasiswa IBIKKG',
          createdAt: new Date().toISOString(),
        };
        await setDoc(doc(db, 'users', firebaseUser.uid), fallbackProfile);
        setUserProfile(fallbackProfile);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      // In case rules or offline, fallback to auth data
      setUserProfile({
        uid: firebaseUser.uid,
        fullName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Mahasiswa APSI',
        nim: '-',
        email: firebaseUser.email || '',
        role: 'Mahasiswa IBIKKG',
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await loadProfile(currentUser);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const registerWithEmail = async (
    email: string,
    pass: string,
    fullName: string,
    nim: string
  ) => {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    await updateProfile(cred.user, { displayName: fullName.trim() });

    const newProfile: UserProfile = {
      uid: cred.user.uid,
      fullName: fullName.trim(),
      nim: nim.trim(),
      email: email.trim(),
      role: 'Mahasiswa IBIKKG',
      createdAt: new Date().toISOString(),
    };

    const path = `users/${cred.user.uid}`;
    try {
      await setDoc(doc(db, 'users', cred.user.uid), newProfile);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
    setUserProfile(newProfile);
  };

  const loginWithEmail = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
    await loadProfile(cred.user);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    await loadProfile(cred.user);
  };

  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        registerWithEmail,
        loginWithEmail,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
