'use client';


import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cognitoSignIn } from '@/lib/cognito-auth';
import { useAuth } from '@/context/AuthContext';


export default function SignInPage() {
 const router = useRouter();
 const { refreshUser } = useAuth();
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [error, setError] = useState('');
 const [loading, setLoading] = useState(false);


 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
   setError('');
   setLoading(true);


   const result = await cognitoSignIn({ email, password });
  
   setLoading(false);
  
   if (result.success) {
     // Refresh the user data in AuthContext
     await refreshUser();
     router.push('/dashboard');
   } else {
     setError(result.error || 'Login failed');
   }
 };


 return (
   <div className="min-h-screen flex items-center justify-center bg-gray-50">
     <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
       <h1 className="text-3xl font-bold mb-6 text-center">Sign In</h1>
      
       <form onSubmit={handleSubmit}>
         <div className="mb-4">
           <label className="block text-gray-700 mb-2">Email</label>
           <input
             type="email"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
             required
           />
         </div>
        
         <div className="mb-6">
           <label className="block text-gray-700 mb-2">Password</label>
           <input
             type="password"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
             required
           />
         </div>
        
         {error && (
           <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
             {error}
           </div>
         )}
        
         <button
           type="submit"
           disabled={loading}
           className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
         >
           {loading ? 'Signing in...' : 'Sign In'}
         </button>
       </form>
      
       <div className="mt-6 text-center">
         <a href="/signup" className="text-blue-600 hover:underline">
           Don't have an account? Sign up
         </a>
       </div>
      
       <div className="mt-2 text-center">
         <a href="/forgot-password" className="text-gray-600 hover:underline text-sm">
           Forgot password?
         </a>
       </div>
     </div>
   </div>
 );
}
