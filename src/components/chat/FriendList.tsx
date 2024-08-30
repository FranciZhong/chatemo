'use client';

import IconButton from '@/components/IconButton';
import { Input } from '@/components/ui/input';
import useConversationStore from '@/store/conversationStore';
import { PlusIcon } from '@radix-ui/react-icons';
import ConversationLink from './ConversationLink';

interface Props {}

const FriendList: React.FC<Props> = ({}) => {
	const { conversations } = useConversationStore();

	return (
		<div className="flex flex-col">
			{/* todo */}
			<div className="flex justify-end items-center gap-2 px-4">
				<Input />
				<IconButton>
					<PlusIcon className="icon-size" />
				</IconButton>
			</div>
			<div className="p-2 w-full h-full flex flex-col gap-1">
				{conversations.map((conversation) => (
					<ConversationLink key={conversation.id} conversation={conversation} />
				))}
			</div>
		</div>
	);
};

export default FriendList;
