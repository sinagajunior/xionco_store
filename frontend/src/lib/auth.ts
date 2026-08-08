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
        // Development bypass - accept any credentials
        return {
          id: '1',
          name: 'Dev User',
          email: 'dev@xionco.local',
          image: null,
        };
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
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
