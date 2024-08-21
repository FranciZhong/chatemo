'use client';

import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
	return (
		<div>
			<Button onClick={() => signIn('google')}>Google</Button>
		</div>
	);
}
