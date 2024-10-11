'use client';

import IconButton from '@/components/IconButton';
import { Input } from '@/components/ui/input';
import { ModalType, NavModalTab, PRESS_ENTER_TEXT } from '@/lib/constants';
import useChannelStore from '@/store/channelStore';
import useModalStore from '@/store/modalStore';
import { ChannelZType } from '@/types/chat';
import { PlusIcon } from '@radix-ui/react-icons';
import Fuse from 'fuse.js';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import ChannelLink from './ChannelLink';

const fuseOption = {
	keys: ['name', 'description'],
	threshold: 0.3,
	includeScore: true,
};

const ChannelList: React.FC = () => {
	const { openModal } = useModalStore();
	const { channels } = useChannelStore();
	const [filteredChannels, setFilteredChannels] = useState<ChannelZType[]>([]);
	const [searchInput, setSearchInput] = useState<string>('');
	const [query] = useDebounce(searchInput, 500);

	useEffect(() => {
		if (query) {
			const fuse = new Fuse(channels, fuseOption);
			const results = fuse.search(query);
			setFilteredChannels(results.map((result) => result.item));
		} else {
			setFilteredChannels(channels);
		}
	}, [query, channels, setFilteredChannels]);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchInput(e.target.value);
	};

	return (
		<div className="flex flex-col">
			<div className="flex justify-end items-center gap-2 px-4">
				<Input
					value={searchInput}
					placeholder={PRESS_ENTER_TEXT}
					onChange={handleSearchChange}
				/>
				<IconButton
					onClick={() =>
						openModal(ModalType.NAV_MODAL, NavModalTab.JOIN_CHANNEL)
					}
				>
					<PlusIcon className="icon-size" />
				</IconButton>
			</div>
			<div className="p-2 w-full h-full flex flex-col gap-1">
				{filteredChannels.map((channel) => (
					<ChannelLink key={channel.id} channel={channel} />
				))}
			</div>
		</div>
	);
};

export default ChannelList;
