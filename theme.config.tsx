import Image from 'next/image';
import { DocsThemeConfig } from 'nextra-theme-docs';
import './src/app/globals.css';

const config: DocsThemeConfig = {
	logo: <span className="text-primary font-bold">CHATEMO</span>,
	logoLink: '/',
	project: {
		link: 'https://github.com/FranciZhong/chatemo',
	},
	chat: {
		icon: (
			<Image
				src="/logo.svg"
				alt="Logo"
				width={24}
				height={24}
				className="rounded-full bg-white"
			/>
		),
		link: '/chat',
	},
	docsRepositoryBase: 'https://github.com/shuding/nextra-docs-template',
	footer: {
		content: <span>© 2024 Chatemo. All rights reserved.</span>,
	},
	feedback: {
		content: 'Report an issue',
		labels: 'issues',
		useLink: () => 'https://github.com/FranciZhong/chatemo/issues/new',
	},
	editLink: {
		component: null,
	},
};

export default config;
