import { decode } from 'next-auth/jwt';

export async function verifyToken(token: string) {
	try {
		const decoded = await decode({
			token,
			secret: process.env.NEXTAUTH_SECRET!,
		});
		return decoded;
	} catch (error) {
		console.error('Failed to verify token:', error);
		return null;
	}
}
