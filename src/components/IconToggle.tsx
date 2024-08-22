'use client';

import { Toggle } from '@radix-ui/react-toggle';

interface Props {
	children: React.ReactNode;
	onClick: () => void;
}

const IconToggle: React.FC<Props> = ({ children, onClick }) => {
	return (
		<Toggle
			className="h-8 w-8 rounded-md flex justify-center items-center bg-background text-foreground hover:bg-hover"
			onClick={onClick}
		>
			{children}
		</Toggle>
	);
};

export default IconToggle;
