'use client';

import IconButton from '@/components/IconButton';
import { Input } from '@/components/ui/input';
import { ModalType, NavModalTab } from '@/lib/constants';
import useAgentStore from '@/store/agentStore';
import useModalStore from '@/store/modalStore';
import { PlusIcon } from '@radix-ui/react-icons';
import AgentLink from './AgentLink';

interface Props {}

const AgentList: React.FC<Props> = ({}) => {
	const { agents } = useAgentStore();
	const { openModal } = useModalStore();

	return (
		<div className="flex flex-col">
			<div className="flex justify-end items-center gap-2 px-4">
				<Input />
				<IconButton
					onClick={() => openModal(ModalType.NAV_MODAL, NavModalTab.ADD_AGENT)}
				>
					<PlusIcon className="icon-size" />
				</IconButton>
			</div>
			<div className="p-2 w-full h-full flex flex-col gap-1">
				{agents.map((agent) => (
					<AgentLink key={agent.id} agent={agent} />
				))}
			</div>
		</div>
	);
};

export default AgentList;
