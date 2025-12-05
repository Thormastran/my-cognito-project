'use client';


import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cognitoSignUp, cognitoConfirmSignUp } from '@/lib/cognito-auth';


export default function SignUpPage() {
 const router = useRouter();
 const [step, setStep] = useState<'signup' | 'confirm'>('signup');
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [name, setName] = useState('');
 const [code, setCode] = useState('');
 const [error, setError] = useState('');
 const [loading, setLoading] = useState(false);


 const handleSignUp = async (e: React.FormEvent) => {
   e.preventDefault();
   setError('');
   setLoading(true);


   const result = await cognitoSignUp({ email, password, name });
  
   setLoading(false);
  
   if (result.success) {
     setStep('confirm');
   } else {
     setError(result.error || 'Sign up failed');
   }
 };


 const handleConfirm = async (e: React.FormEvent) => {
   e.preventDefault();
   setError('');
   setLoading(true);


   const result = await cognitoConfirmSignUp(email, code);
  
   setLoading(false);
  
   if (result.success) {
     router.push('/signin');
   } else {
     setError(result.error || 'Verification failed');
   }
 };


 if (step === 'confirm') {
   return (
     <div className="min-h-screen flex items-center justify-center">
       <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
         <h1 className="text-2xl font-bold mb-6">Verify Email</h1>
         <p className="mb-4 text-gray-600">
           Enter the verification code sent to {email}
         </p>
        
         <form onSubmit={handleConfirm}>
           <input
             type="text"
             placeholder="Verification Code"
             value={code}
             onChange={(e) => setCode(e.target.value)}
             className="w-full px-4 py-2 border rounded-lg mb-4"
             required
           />
          
           {error && <p className="text-red-500 mb-4">{error}</p>}
          
           <button
             type="submit"
             disabled={loading}
             className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
           >
             {loading ? 'Verifying...' : 'Verify Email'}
           </button>
         </form>
       </div>
     </div>
   );
 }


 return (
   <div className="min-h-screen flex items-center justify-center">
     <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
       <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
      
       <form onSubmit={handleSignUp}>
         <input
           type="text"
           placeholder="Full Name"
           value={name}
           onChange={(e) => setName(e.target.value)}
           className="w-full px-4 py-2 border rounded-lg mb-4"
           required
         />
        
         <input
           type="email"
           placeholder="Email"
           value={email}
           onChange={(e) => setEmail(e.target.value)}
           className="w-full px-4 py-2 border rounded-lg mb-4"
           required
         />
        
         <input
           type="password"
           placeholder="Password"
           value={password}
           onChange={(e) => setPassword(e.target.value)}
           className="w-full px-4 py-2 border rounded-lg mb-4"
           required
         />
        
         <p className="text-xs text-gray-500 mb-4">
           Password must be at least 8 characters with uppercase, lowercase, number, and special character
         </p>
        
         {error && <p className="text-red-500 mb-4">{error}</p>}
        
         <button
           type="submit"
           disabled={loading}
           className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
         >
           {loading ? 'Signing up...' : 'Sign Up'}
         </button>
       </form>
     </div>
   </div>
 );
}
