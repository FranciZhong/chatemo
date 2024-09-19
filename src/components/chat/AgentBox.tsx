'use client';

import axiosInstance from '@/lib/axios';
import { ApiUrl, PageUrl } from '@/lib/constants';
import useAgentStore from '@/store/agentStore';
import { FormatResponse } from '@/types/common';
import { AgentPromptPayload, AgentZType } from '@/types/llm';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { toast } from '../ui/use-toast';
import AgentPrompt from './AgentPrompt';
import Editer from './Editer';

interface Props {
	agentId: string;
}

const AgentBox: React.FC<Props> = ({ agentId }) => {
	const [messageContent, setMessageContent] = useState('');
	const { agents, updateAgent } = useAgentStore();
	const agent = agents.find((item) => item.id === agentId);

	if (!agent) {
		redirect(PageUrl.CHAT);
	}

	const handleSubmit = async () => {
		try {
			const response = await axiosInstance.post<FormatResponse<AgentZType>>(
				ApiUrl.AGENT_PROMPT,
				{ agentId, content: messageContent } as AgentPromptPayload
			);

			const agent = response.data.data;
			if (agent) {
				updateAgent(agent);
			}
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Something went wrong.',
			});
		}
	};

	return (
		<div className="w-full h-full flex flex-col justify-end">
			<ScrollArea className="flex-1">
				<div className="w-full p-4 flex flex-col gap-4">
					{agent.prompts?.map((prompt) => (
						<AgentPrompt
							key={prompt.id}
							prompt={prompt}
							name={agent.name}
							image={agent.image}
						/>
					))}
				</div>
			</ScrollArea>
			<Separator orientation="horizontal" />
			<Editer
				messageContent={messageContent}
				setMessageContent={setMessageContent}
				onSubmit={handleSubmit}
			/>
		</div>
	);
};

export default AgentBox;
