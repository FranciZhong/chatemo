'use client';

import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import ChatEditer from './ChatEditer';
import MessageList from './MessageList';

interface Props {}

const ChatBox: React.FC<Props> = ({}) => {
	return (
		<div className="w-full h-full flex flex-col justify-end">
			<div className="flex-1 overflow-hidden">
				<ScrollArea className="w-full h-full">
					<MessageList />
				</ScrollArea>
			</div>
			<Separator orientation="horizontal" />
			<ChatEditer onSubmit={() => {}} />
		</div>
	);
};

export default ChatBox;
