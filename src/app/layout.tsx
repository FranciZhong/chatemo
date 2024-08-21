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
		<html lang="en">
			<body className={roboto.className}>{children}</body>
		</html>
	);
}
