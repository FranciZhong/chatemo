import SessionProviderWrapper from '@/context/SessionProviderWrapper';
import { ThemeProvider } from '@/context/ThemeProvider';
import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';

const roboto = Nunito({
	weight: '400',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Chatemo',
	description: 'A chat app powered by AI solutions',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={roboto.className}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<SessionProviderWrapper>{children}</SessionProviderWrapper>
				</ThemeProvider>
			</body>
		</html>
	);
}
