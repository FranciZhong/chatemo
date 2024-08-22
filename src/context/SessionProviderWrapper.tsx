'use client';

import { SessionProvider } from 'next-auth/react';

interface Props {
	children: React.ReactNode;
}

const SessionProviderWrapper: React.FC<Props> = ({ children }) => {
	return <SessionProvider>{children}</SessionProvider>;
};

export default SessionProviderWrapper;
