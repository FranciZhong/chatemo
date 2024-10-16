import nextra from 'nextra';

const withNextra = nextra({
	theme: 'nextra-theme-docs',
	themeConfig: './theme.config.tsx',
});

const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'chatemo.s3.ap-southeast-2.amazonaws.com',
				port: '',
				pathname: '/**',
			},
		],
	},
	pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
};

export default withNextra(nextConfig);
