import axiosInstance from '@/lib/axios';
import { ApiUrl, ImgUrl } from '@/lib/constants';
import { parseFormatedDateTime } from '@/lib/date';
import useAgentStore from '@/store/agentStore';
import { FormatResponse } from '@/types/common';
import { AgentPromptZType, AgentZType } from '@/types/llm';
import { Trash2Icon } from 'lucide-react';
import { memo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

interface Props {
	prompt: AgentPromptZType;
	name: string;
	image?: string | null;
}

const AgentPrompt: React.FC<Props> = ({ prompt, name, image }) => {
	const [mouseOn, setMouseOn] = useState(false);
	const [showButtons] = useDebounce(mouseOn, 500);
	const { updateAgent } = useAgentStore();

	const datetimeObject = parseFormatedDateTime(prompt.createdAt);

	const handleClickDelete = async () => {
		try {
			const resposne = await axiosInstance.delete<FormatResponse<AgentZType>>(
				ApiUrl.AGENT_PROMPT,
				{
					params: {
						promptId: prompt.id,
					},
				}
			);

			const agent = resposne.data.data;
			if (agent) {
				updateAgent(agent);
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div
			className="w-full flex"
			onMouseEnter={() => setMouseOn(true)}
			onMouseLeave={() => setMouseOn(false)}
		>
			<div className="flex gap-2 items-start">
				<Avatar className="h-8 w-8 bg-secondary">
					<AvatarImage src={image || ImgUrl.AGENT_AVATAR_ALT} />
				</Avatar>
				<div className="flex flex-col gap-1 message-width items-start">
					<div className="flex gap-2 items-center h-8 w-full">
						<div className="text-lg font-bold">{name}</div>
						{showButtons && (
							<ScrollArea className="flex-1">
								<div className="flex items-center gap-2">
									<Button
										onClick={handleClickDelete}
										size="xs"
										variant="outline"
										className="hover:bg-accent"
									>
										<Trash2Icon className="icon-size" />
									</Button>
								</div>
								<ScrollBar orientation="horizontal" className="invisible" />
							</ScrollArea>
						)}
					</div>

					<div className="message-container">
						<p className="break-words">{prompt.content}</p>
					</div>
					<p className="text-xs text-foreground/50 font-thin">
						{datetimeObject.date} {datetimeObject.time}
					</p>
				</div>
			</div>
		</div>
	);
};

export default memo(AgentPrompt);
