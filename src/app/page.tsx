'use client';

import LoadingPage from '@/components/LoadingPage';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { PageUrl } from './constants';

const Home: React.FC = () => {
	const { data: session, status } = useSession();

	if (status === 'loading') {
		return <LoadingPage />;
	}

	redirect(session ? PageUrl.CHAT : PageUrl.LOGIN);
};

export default Home;
