'use client';

import { Separator } from '../ui/separator';
import NavSidebar from './NavSidebar';

interface Props {
	children: React.ReactNode;
}

const ChatLayout: React.FC<Props> = ({ children }) => {
	return (
		<div className="w-screen h-screen flex">
			<NavSidebar />
			<Separator orientation="vertical" />
			<div className="flex-1">{children}</div>
		</div>
	);
};

export default ChatLayout;
