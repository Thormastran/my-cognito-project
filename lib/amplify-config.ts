import { Amplify } from 'aws-amplify';


// Cấu hình Cognito – chỉ chạy 1 lần duy nhất


export const amplifyConfig = {
    Auth: {
        Cognito: {
            userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
            userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID!,
            loginWith: {
                username: false,
                email: true,
            },
        },
    },
};


// Configure Amplify with SSR support
Amplify.configure(amplifyConfig, {
    ssr: true, // Important for Next.js
});
