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
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserRole, UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  activeRole: UserRole;
  loading: boolean;
  registerWithEmail: (email: string, pass: string, fullName: string, nim: string, initialRole?: UserRole) => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserRole: (newRole: UserRole, targetUid?: string) => Promise<void>;
  setActiveRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to determine role from email or stored string
const resolveRole = (email?: string | null, rawRole?: string): UserRole => {
  if (email && email.toLowerCase() === 'stefanleonard935@gmail.com') {
    return 'admin';
  }
  if (!rawRole) return 'student';
  const r = rawRole.toLowerCase();
  if (r.includes('admin')) return 'admin';
  if (r.includes('tutor') || r.includes('dosen')) return 'tutor';
  return 'student';
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeRole, setActiveRole] = useState<UserRole>('student');
  const [loading, setLoading] = useState(true);

  // Sync profile from Firestore
  const loadProfile = async (firebaseUser: User) => {
    try {
      const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (snap.exists()) {
        const data = snap.data();
        const role = resolveRole(firebaseUser.email, data.role);
        const profile: UserProfile = {
          uid: firebaseUser.uid,
          fullName: data.fullName || firebaseUser.displayName || 'Pengguna FanEDU',
          nim: data.nim || '-',
          email: firebaseUser.email || '',
          role,
          createdAt: data.createdAt,
        };
        setUserProfile(profile);
        setActiveRole(role);
      } else {
        const role = resolveRole(firebaseUser.email, 'student');
        const fallbackProfile: UserProfile = {
          uid: firebaseUser.uid,
          fullName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Pengguna FanEDU',
          nim: '-',
          email: firebaseUser.email || '',
          role,
          createdAt: new Date().toISOString(),
        };
        await setDoc(doc(db, 'users', firebaseUser.uid), fallbackProfile);
        // If admin, also seed into admins collection for security rule checks
        if (role === 'admin') {
          try {
            await setDoc(doc(db, 'admins', firebaseUser.uid), {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              assignedAt: new Date().toISOString(),
            });
          } catch (e) {
            console.warn('Could not register in admins collection:', e);
          }
        }
        setUserProfile(fallbackProfile);
        setActiveRole(role);
      }
    } catch (err) {
      console.warn('Profile read error, using fallback:', err);
      const role = resolveRole(firebaseUser.email, 'student');
      const fallback: UserProfile = {
        uid: firebaseUser.uid,
        fullName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Pengguna FanEDU',
        nim: '-',
        email: firebaseUser.email || '',
        role,
      };
      setUserProfile(fallback);
      setActiveRole(role);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await loadProfile(currentUser);
      } else {
        setUserProfile(null);
        setActiveRole('student');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const registerWithEmail = async (
    email: string,
    pass: string,
    fullName: string,
    nim: string,
    initialRole: UserRole = 'student'
  ) => {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    await updateProfile(cred.user, { displayName: fullName.trim() });

    const role = resolveRole(email, initialRole);
    const newProfile: UserProfile = {
      uid: cred.user.uid,
      fullName: fullName.trim(),
      nim: nim.trim(),
      email: email.trim(),
      role,
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'users', cred.user.uid), newProfile);
      if (role === 'admin') {
        await setDoc(doc(db, 'admins', cred.user.uid), {
          uid: cred.user.uid,
          email: email.trim(),
          assignedAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.warn('Could not save user profile directly to Firestore:', err);
    }
    setUserProfile(newProfile);
    setActiveRole(role);
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
    setActiveRole('student');
  };

  const updateUserRole = async (newRole: UserRole, targetUid?: string) => {
    const uidToUpdate = targetUid || user?.uid;
    if (!uidToUpdate) return;

    try {
      await updateDoc(doc(db, 'users', uidToUpdate), { role: newRole });
      if (newRole === 'admin') {
        await setDoc(doc(db, 'admins', uidToUpdate), {
          uid: uidToUpdate,
          assignedAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.warn('Update role in Firestore notice:', err);
    }

    if (!targetUid || targetUid === user?.uid) {
      setUserProfile((prev) => (prev ? { ...prev, role: newRole } : null));
      setActiveRole(newRole);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        activeRole,
        loading,
        registerWithEmail,
        loginWithEmail,
        loginWithGoogle,
        logout,
        updateUserRole,
        setActiveRole,
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
