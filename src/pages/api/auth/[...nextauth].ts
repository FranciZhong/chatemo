import { PageUrl } from '@/lib/constants';
import { prisma } from '@/lib/db';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
	],
	pages: {
		signIn: '/login',
	},
	debug: process.env.NODE_ENV === 'development',
	session: {
		strategy: 'jwt',
	},
	callbacks: {
		signIn: async ({ user, account }) => {
			if (account?.provider === 'google') {
				return !!user.email;
			}
			return false;
		},
		async jwt({ token, account, user }) {
			if (account) {
				token.accessToken = account.access_token;
				token.id = user.id;
			}
			return token;
		},
		session: async ({ session, token }) => {
			if (token) {
				session.user.id = token?.id as string;
				session.user.accessToken = token?.accessToken as string;
			}
			return session;
		},
		redirect: async () => {
			return PageUrl.HOME;
		},
	},
};

const handler = NextAuth(authOptions);

export default handler;
