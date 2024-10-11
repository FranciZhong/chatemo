'use client';

import IconButton from '@/components/IconButton';
import { Input } from '@/components/ui/input';
import { ModalType, NavModalTab, PRESS_ENTER_TEXT } from '@/lib/constants';
import useConversationStore from '@/store/conversationStore';
import useModalStore from '@/store/modalStore';
import { ConversationZType } from '@/types/chat';
import { PlusIcon } from '@radix-ui/react-icons';
import Fuse from 'fuse.js';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import ConversationLink from './ConversationLink';

const fuseOption = {
	keys: ['participants.user.name', 'participants.user.email'],
	threshold: 0.3,
	includeScore: true,
};

const ConversationList: React.FC = () => {
	const { conversations } = useConversationStore();
	const { openModal } = useModalStore();
	const [filteredConversations, setFilteredConversations] = useState<
		ConversationZType[]
	>([]);
	const [searchInput, setSearchInput] = useState<string>('');
	const [query] = useDebounce(searchInput, 300);

	useEffect(() => {
		if (query) {
			const fuse = new Fuse(conversations, fuseOption);
			const results = fuse.search(query);
			setFilteredConversations(results.map((result) => result.item));
		} else {
			setFilteredConversations(conversations);
		}
	}, [query, conversations, setFilteredConversations]);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchInput(e.target.value);
	};

	return (
		<div className="flex flex-col">
			{/* todo */}
			<div className="flex justify-end items-center gap-2 px-4">
				<Input
					value={searchInput}
					placeholder={PRESS_ENTER_TEXT}
					onChange={handleSearchChange}
				/>
				<IconButton
					onClick={() =>
						openModal(ModalType.NAV_MODAL, NavModalTab.FIND_FRIEND)
					}
				>
					<PlusIcon className="icon-size" />
				</IconButton>
			</div>
			<div className="p-2 w-full h-full flex flex-col gap-1">
				{filteredConversations.map((conversation) => (
					<ConversationLink key={conversation.id} conversation={conversation} />
				))}
			</div>
		</div>
	);
};

export default ConversationList;
