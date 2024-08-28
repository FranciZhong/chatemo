import { PageUrl } from '@/app/constants';
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
		jwt: async ({ token, user }) => {
			if (user) {
				token.id = user.id;
			}
			return token;
		},
		session: async ({ session, token }) => {
			let userId = (token?.id as string) || null;
			if (userId) {
				session.user.id = userId;
			}
			return session;
		},
		redirect: async () => {
			return PageUrl.HOME;
		},
	},
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
