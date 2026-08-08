import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';
import { Session } from 'next-auth';

interface CustomToken extends JWT {
  accessToken?: string;
}

interface CustomSession extends Session {
  accessToken?: string;
}

const providers = [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  }),
  FacebookProvider({
    clientId: process.env.FACEBOOK_CLIENT_ID || '',
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
  }),
];

// Add credentials provider only in development
if (process.env.NODE_ENV === 'development') {
  providers.push(
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Development bypass - accept any credentials and fetch backend token
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
          console.log('Authorize: Fetching backend token from', apiUrl);

          const response = await fetch(`${apiUrl}/api/auth/dev-login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            console.error('Authorize: Backend returned', response.status);
            throw new Error(`Backend returned ${response.status}`);
          }

          const data = await response.json();
          console.log('Authorize: Got backend token');

          if (!data.token) {
            throw new Error('No token in backend response');
          }

          // Return user with token attached
          return {
            id: '1',
            name: 'Dev User',
            email: 'dev@xionco.local',
            image: null,
            accessToken: data.token,
          } as any;
        } catch (error) {
          console.error('Authorize error:', error);
          throw error;
        }
      },
    })
  );
}

export const authOptions: NextAuthOptions = {
  providers,
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // Add user data to token on initial sign in
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;

        // Check if user object has accessToken already (from authorize callback)
        if ((user as any).accessToken) {
          (token as CustomToken).accessToken = (user as any).accessToken;
          console.log('JWT: Using accessToken from authorize callback');
        }
        // For OAuth providers that return access_token in account
        else if (!account && !(token as CustomToken).accessToken) {
          // For dev login without pre-fetched token, fetch it now
          try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            console.log('JWT: Fetching backend token from:', apiUrl);
            const response = await fetch(`${apiUrl}/api/auth/dev-login`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            if (!response.ok) {
              throw new Error(`Backend returned ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('JWT: Backend token response:', { hasToken: !!data.token });

            if (data.token) {
              (token as CustomToken).accessToken = data.token;
              console.log('JWT: AccessToken set successfully');
            } else {
              console.warn('JWT: No token in backend response');
            }
          } catch (error) {
            console.error('JWT: Failed to fetch backend token:', error);
            (token as any).tokenError = error instanceof Error ? error.message : 'Unknown error';
          }
        }
      }
      if (account?.access_token) {
        (token as CustomToken).accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Return user data in session
      if (session.user) {
        session.user.id = token.sub || token.id;
        session.user.name = token.name;
        session.user.email = token.email;
      }
      (session as CustomSession).accessToken = (token as CustomToken).accessToken;

      // Log for debugging
      console.log('Session callback:', {
        hasAccessToken: !!(token as CustomToken).accessToken,
        tokenError: (token as any).tokenError,
      });

      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
