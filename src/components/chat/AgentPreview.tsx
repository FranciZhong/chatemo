import { ImgUrl } from '@/lib/constants';
import useUserStore from '@/store/userStore';
import OpenAI from 'openai';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypePrism from 'rehype-prism';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import { Avatar, AvatarImage } from '../ui/avatar';

interface Props {
	request: string;
}

const AgentPreview: React.FC<Props> = ({ request }) => {
	const [response, setResponse] = useState('');
	const { user } = useUserStore();

	const openai = new OpenAI({
		apiKey: user?.config?.apiConfig?.openaiApiKey || '',
		dangerouslyAllowBrowser: true,
	});

	// todo now for testing only

	const askChatGpt = async (
		request: string,
		onUpdate: (chunk: string) => void
	) => {
		const stream = await openai.chat.completions.create({
			model: 'gpt-4o-mini',
			stream: true,
			messages: [
				{
					role: 'user',
					content: request,
				},
			],
		});

		for await (const chunk of stream) {
			onUpdate(chunk.choices[0]?.delta?.content || '');
		}

		console.log('done');
	};

	const handleUpdate = (chunk: string) => {
		setResponse((state) => state + chunk);
	};

	useEffect(() => {
		const requestChatGpt = async () => {
			await askChatGpt(request, handleUpdate);
		};

		requestChatGpt();
	}, []);

	return (
		<div className="p-2 w-full overflow-hidden">
			<div className="flex gap-2 items-start">
				<Avatar className="h-8 w-8 bg-secondary">
					<AvatarImage src={ImgUrl.AGENT_AVATAR_ALT} />
				</Avatar>
				<div className="flex flex-col gap-1 message-width items-start">
					<div className="text-lg font-bold">AGENT</div>

					<div className="message-container">
						<ReactMarkdown
							className="prose"
							remarkPlugins={[remarkGfm, remarkBreaks]}
							rehypePlugins={[rehypePrism]}
						>
							{response}
						</ReactMarkdown>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AgentPreview;
