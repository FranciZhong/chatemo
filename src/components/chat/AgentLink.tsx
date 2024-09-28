'use client';

import axiosInstance from '@/lib/axios';
import { ApiUrl, ImgUrl, PageUrl, TOAST_ERROR_DEFAULT } from '@/lib/constants';
import useAgentStore from '@/store/agentStore';
import { FormatResponse, IdPayload } from '@/types/common';
import { AgentZType } from '@/types/llm';
import { HttpStatusCode } from 'axios';
import { useCallback, useRef } from 'react';
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from '../ui/context-menu';
import { toast } from '../ui/use-toast';
import WarningTrigger from '../WarningTrigger';
import LinkTab from './LinkTab';

interface Props {
	agent: AgentZType;
}

const AgentLink: React.FC<Props> = ({ agent }) => {
	const { removeAgent } = useAgentStore();
	const deleteWarningRef = useRef<HTMLDivElement | null>(null);

	const handleDelete = useCallback(async () => {
		try {
			const response = await axiosInstance.post<FormatResponse<any>>(
				ApiUrl.DELETE_AGENT,
				{
					referToId: agent.id,
				} as IdPayload
			);

			if (response.status === HttpStatusCode.Ok) {
				removeAgent(agent.id);
			}
		} catch (error) {
			toast(TOAST_ERROR_DEFAULT);
		}
	}, [agent, removeAgent]);

	return (
		<div>
			<ContextMenu>
				<ContextMenuTrigger>
					<LinkTab
						href={PageUrl.AGENTS + '/' + agent.id}
						image={agent.image || ImgUrl.AGENT_AVATAR_ALT}
						title={agent.name || ' '}
						description={
							<p className="text-single-line text-sm text-foreground/60 font-light">
								{agent.description || ' '}
							</p>
						}
					/>
				</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuItem
						onClick={() => deleteWarningRef.current?.click()}
						className="focus:bg-accent"
					>
						Remove
					</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>
			<WarningTrigger onContinue={handleDelete}>
				<div ref={deleteWarningRef} />
			</WarningTrigger>
		</div>
	);
};

export default AgentLink;
