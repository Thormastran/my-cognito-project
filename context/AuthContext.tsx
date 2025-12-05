'use client';


import { createContext, useContext, useEffect, useState } from 'react';
import { getCognitoUser, cognitoSignOut  } from '@/lib/cognito-auth';


interface User {
 userId: string;
 email: string;
 name: string;
 role: 'admin' | 'user';
}


interface AuthContextType {
 user: User | null;
 loading: boolean;
 signOut: () => Promise<void>;
 refreshUser: () => Promise<void>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({ children }: { children: React.ReactNode }) {
 const [user, setUser] = useState<User | null>(null);
 const [loading, setLoading] = useState(true);


 const loadUser = async () => {
   try {
     const userData = await getCognitoUser();
     if (userData) {
       const mappedUser: User = {
         userId: userData.userId,
         email: userData.email,
         name: userData.name,
         role: userData.role === 'admin' ? 'admin' : 'user',
       };
       setUser(mappedUser);
     } else {
       setUser(null);
     }
   } catch (error) {
     console.error('Failed to load user:', error);
     setUser(null);
   } finally {
     setLoading(false);
   }
 };


 useEffect(() => {
   loadUser();
 }, []);


  const signOut = async () => {
    try {
      console.log('[AuthContext.signOut] 🚪 Signing out...');
      await cognitoSignOut();
      setUser(null);
      console.log('[AuthContext.signOut] ✅ User signed out');
    } catch (error) {
      console.error('[AuthContext.signOut] ❌ Sign out error:', error);
    }
  };
 return (
   <AuthContext.Provider
     value={{
       user,
       loading,
       signOut: signOut ,
       refreshUser: loadUser,
     }}
   >
     {children}
   </AuthContext.Provider>
 );
}


export function useAuth() {
 const context = useContext(AuthContext);
 if (context === undefined) {
   throw new Error('useAuth must be used within AuthProvider');
 }
 return context;
}

