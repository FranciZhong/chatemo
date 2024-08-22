import ChatLayout from '@/components/layout/ChatLayout';

interface Props {
	children: React.ReactNode;
}

const layout: React.FC<Props> = ({ children }) => {
	// todo data init

	return (
		<main>
			<ChatLayout>{children}</ChatLayout>
		</main>
	);
};

export default layout;
