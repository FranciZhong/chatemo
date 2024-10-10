'use client';

import axiosInstance from '@/lib/axios';
import {
	ApiUrl,
	LlmProviderName,
	PageUrl,
	TOAST_ERROR_DEFAULT,
} from '@/lib/constants';
import useAgentStore from '@/store/agentStore';
import useUserStore from '@/store/userStore';
import { FormatResponse } from '@/types/common';
import { AgentPromptPayload, AgentZType, LlmModelZType } from '@/types/llm';
import { RocketIcon } from '@radix-ui/react-icons';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import IconButton from '../IconButton';
import SelectModelButton from '../SelectModelButton';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { toast } from '../ui/use-toast';
import AgentPreview from './AgentPreview';
import AgentPrompt from './AgentPrompt';
import Editer from './Editer';

interface Props {
	agentId: string;
}

const AgentBox: React.FC<Props> = ({ agentId }) => {
	const [messageContent, setMessageContent] = useState('');
	const [openPreview, setOpenPreview] = useState<boolean>(false);
	const [previewRequest, setPreviewRequest] = useState<string>('');
	const { user } = useUserStore();
	const { agents, updateAgent } = useAgentStore();
	const agent = agents.find((item) => item.id === agentId);

	const [selectedModel, setSelectedModel] = useState<LlmModelZType>(
		agent?.config?.defaultModel ||
			user?.config?.modelConfig?.defaultModel || {
				provider: LlmProviderName.OPENAI,
				model: 'gpt-4o',
			}
	);

	if (!agent) {
		redirect(PageUrl.CHAT);
	}

	const handleOpenPreview = () => {
		setOpenPreview(true);
		setPreviewRequest(messageContent);
		setMessageContent('');
	};

	const handleClosePreview = () => {
		setOpenPreview(false);
		setPreviewRequest('');
	};

	const actions = [
		<SelectModelButton
			key="model-button"
			selectedModel={selectedModel}
			onSelectedModelChange={setSelectedModel}
		/>,
		<IconButton key="preview-button" onClick={handleOpenPreview}>
			<RocketIcon className="icon-size" />
		</IconButton>,
	];

	const handleSubmit = async () => {
		if (openPreview) {
			if (!messageContent.length) {
				return;
			}

			setPreviewRequest(messageContent);
		} else {
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
				toast(TOAST_ERROR_DEFAULT);
			}
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
				actions={actions}
			>
				{openPreview && (
					<AgentPreview
						request={previewRequest}
						model={selectedModel}
						agent={agent}
						onClose={handleClosePreview}
						className="h-96 md:h-[480px]"
					/>
				)}
			</Editer>
		</div>
	);
};

export default AgentBox;
