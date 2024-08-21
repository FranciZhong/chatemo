'use client';

import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
	return (
		<Card className="w-96 p-4 flex flex-col justify-between gap-8">
			<CardHeader className="items-center">
				<CardTitle className="text-black">Login By</CardTitle>
			</CardHeader>
			<CardFooter className="flex flex-col justify-between gap-4">
				<Button className="w-full" onClick={() => signIn('google')}>
					Google
				</Button>
			</CardFooter>
		</Card>
	);
}
