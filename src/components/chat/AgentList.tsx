'use client';

import IconButton from '@/components/IconButton';
import { Input } from '@/components/ui/input';
import { ModalType, NavModalTab } from '@/lib/constants';
import useAgentStore from '@/store/agentStore';
import useModalStore from '@/store/modalStore';
import { AgentZType } from '@/types/llm';
import { PlusIcon } from '@radix-ui/react-icons';
import Fuse from 'fuse.js';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import AgentLink from './AgentLink';

const fuseOption = {
	keys: ['name', 'description'],
	threshold: 0.3,
	includeScore: true,
};

const AgentList: React.FC = () => {
	const { agents } = useAgentStore();
	const { openModal } = useModalStore();
	const [filteredAgents, setFilteredAgents] = useState<AgentZType[]>([]);
	const [searchInput, setSearchInput] = useState<string>('');
	const [query] = useDebounce(searchInput, 300);

	useEffect(() => {
		if (query) {
			const fuse = new Fuse(agents, fuseOption);
			const results = fuse.search(query);
			setFilteredAgents(results.map((result) => result.item));
		} else {
			setFilteredAgents(agents);
		}
	}, [query, agents, setFilteredAgents]);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchInput(e.target.value);
	};

	return (
		<div className="flex flex-col">
			<div className="flex justify-end items-center gap-2 px-4">
				<Input value={searchInput} onChange={handleSearchChange} />
				<IconButton
					onClick={() => openModal(ModalType.NAV_MODAL, NavModalTab.ADD_AGENT)}
				>
					<PlusIcon className="icon-size" />
				</IconButton>
			</div>
			<div className="p-2 w-full h-full flex flex-col gap-1">
				{filteredAgents.map((agent) => (
					<AgentLink key={agent.id} agent={agent} />
				))}
			</div>
		</div>
	);
};

export default AgentList;
