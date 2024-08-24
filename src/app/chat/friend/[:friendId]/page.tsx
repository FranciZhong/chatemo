'use client';

import ChatBox from '@/components/chat/ChatBox';
import NavTopbar from '@/components/layout/NavTopbar';
import { Separator } from '@/components/ui/separator';

const page: React.FC = () => {
	return (
		<div className="h-full w-full flex flex-col">
			<NavTopbar />
			<Separator orientation="horizontal" />
			<div className="flex-1 overflow-hidden">
				<ChatBox />
			</div>
		</div>
	);
};

export default page;
