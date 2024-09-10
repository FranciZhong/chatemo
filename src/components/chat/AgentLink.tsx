'use client';

import ItemContainer from '@/components/ItemContainer';
import { ImgUrl, PageUrl } from '@/lib/constants';
import { AgentZType } from '@/types/llm';
import Link from 'next/link';
import { Avatar, AvatarImage } from '../ui/avatar';

interface Props {
	agent: AgentZType;
}

const AgentLink: React.FC<Props> = ({ agent }) => {
	return (
		<Link href={PageUrl.AGENTS + '/' + agent.id}>
			<ItemContainer className="px-2 h-14 w-full flex gap-2 items-center hover:cursor-pointer">
				<Avatar className="h-10 w-10 rounded-full bg-secondary">
					<AvatarImage
						className="rounded-full"
						src={agent.image || ImgUrl.AGENT_AVATAR_ALT}
					/>
				</Avatar>
				<div className="flex flex-col">
					<div>{agent.name}</div>
					<p className="text-single-line text-sm text-foreground/60 font-light">
						{agent.description}
					</p>
				</div>
			</ItemContainer>
		</Link>
	);
};

export default AgentLink;
