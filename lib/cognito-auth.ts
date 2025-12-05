import { Amplify } from 'aws-amplify';
import {
 signUp,
 signIn,
 signOut,
 confirmSignUp,
 resendSignUpCode,
 getCurrentUser,
 fetchAuthSession,
 fetchUserAttributes,
 resetPassword,
 confirmResetPassword,
 type SignUpInput,
 type SignInInput,
} from 'aws-amplify/auth';

// Import amplify config để ensure được configure
import '@/lib/amplify-config';

// Ensure Amplify is configured
function ensureAmplifyConfigured() {
  const config = Amplify.getConfig();
  if (!config.Auth?.Cognito?.userPoolId) {
    console.error('Amplify not configured properly. Missing userPoolId.');
    throw new Error('Auth UserPool not configured');
  }
}

// ============================================
// SIGN UP
// ============================================


export interface SignUpParams {
 email: string;
 password: string;
 name: string;
}


export async function cognitoSignUp({ email, password, name }: SignUpParams) {
 try {
   const signUpInput: SignUpInput = {
     username: email.trim(),
     password: password.trim(),
     options: {
       userAttributes: {
         email: email.trim(),
         name: name.trim(),
       },
     },
   };


   const { isSignUpComplete, userId, nextStep } = await signUp(signUpInput);


   return {
     success: true,
     isSignUpComplete,
     userId,
     nextStep,
     message: 'Sign up successful! Check your email for verification.',
   };
 } catch (error: any) {
   console.error('Sign up error:', error);
  
   // Handle specific errors
   if (error.name === 'UsernameExistsException') {
     return { success: false, error: 'Account already exists.' };
   }
  
   return {
     success: false,
     error: error.message || 'Sign up failed',
   };
 }
}


// ============================================
// CONFIRM SIGN UP
// ============================================


export async function cognitoConfirmSignUp(email: string, code: string) {
 try {
   await confirmSignUp({
     username: email,
     confirmationCode: code,
   });


   return {
     success: true,
     message: 'Email verified! You can now sign in.',
   };
 } catch (error: any) {
   console.error('Confirm sign up error:', error);
   return {
     success: false,
     error: error.message || 'Verification failed',
   };
 }
}


// ============================================
// SIGN IN
// ============================================


export interface SignInParams {
 email: string;
 password: string;
}


export async function cognitoSignIn({ email, password }: SignInParams) {
 try {
   const { isSignedIn, nextStep } = await signIn({
     username: email.trim(),
     password: password.trim(),
   });


   if (isSignedIn) {
     // Get user data
     const session = await fetchAuthSession();
     const attributes = await fetchUserAttributes();
    
     return {
       success: true,
       isSignedIn,
       user: attributes,
       message: 'Sign in successful!',
     };
   }


   // Handle additional steps (MFA, password change, etc.)
   return {
     success: false,
     nextStep,
     error: 'Additional steps required',
   };
 } catch (error: any) {
   console.error('Sign in error:', error);
  
   if (error.name === 'NotAuthorizedException') {
     return { success: false, error: 'Invalid email or password' };
   }
   if (error.name === 'UserNotConfirmedException') {
     return { success: false, error: 'Please verify your email first' };
   }
  
   return { success: false, error: error.message || 'Sign in failed' };
 }
}


// ============================================
// SIGN OUT
// ============================================


export async function cognitoSignOut() {
 try {
   await signOut();
   return {
     success: true,
     message: 'Signed out successfully',
   };
 } catch (error: any) {
   console.error('Sign out error:', error);
   return {
     success: false,
     error: error.message || 'Sign out failed',
   };
 }
}


// ============================================
// GET CURRENT USER
// ============================================


export async function getCognitoUser() {
 try {
   ensureAmplifyConfigured();
   
   // Check if user is authenticated first
   const session = await fetchAuthSession();
   if (!session.tokens) {
     // User is not authenticated
     return null;
   }
   
   const currentUser = await getCurrentUser();
   const attributes = await fetchUserAttributes();
  
   // Extract groups from ID token
   const idTokenPayload = session.tokens?.idToken?.payload;
   const groups = (idTokenPayload?.['cognito:groups'] as string[]) || [];
  
   return {
     userId: currentUser.userId,
     username: currentUser.username,
     email: attributes.email || '',
     name: attributes.name || '',
     groups,
     role: groups.includes('admin') ? 'admin' : 'user',
   };
 } catch (error: any) {
   // Handle specific authentication errors
   if (error.name === 'UserUnAuthenticatedException' || 
       error.message?.includes('User needs to be authenticated')) {
     console.log('User not authenticated');
     return null;
   }
   
   console.error('Get user error:', error);
   return null;
 }
}


// ============================================
// PASSWORD RESET
// ============================================


export async function cognitoResetPassword(email: string) {
 try {
   await resetPassword({ username: email });
  
   return {
     success: true,
     message: 'Reset code sent to your email',
   };
 } catch (error: any) {
   console.error('Reset password error:', error);
   return {
     success: false,
     error: error.message || 'Failed to reset password',
   };
 }
}


export async function cognitoConfirmResetPassword(
 email: string,
 code: string,
 newPassword: string
) {
 try {
   await confirmResetPassword({
     username: email,
     confirmationCode: code,
     newPassword,
   });


   return {
     success: true,
     message: 'Password reset successful!',
   };
 } catch (error: any) {
   console.error('Confirm reset error:', error);
   return {
     success: false,
     error: error.message || 'Failed to reset password',
   };
 }
}
