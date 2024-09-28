import { AvatarSize, ImgUrl } from '@/lib/constants';
import { cn, getAvatarSizeStyle } from '@/lib/utils';
import { AgentZType } from '@/types/llm';
import { memo } from 'react';
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';

interface Props {
	agent: AgentZType;
	onClick: () => void;
}

const AgentHelpButton: React.FC<Props> = ({ agent, onClick }) => {
	return (
		<Button size="xs" variant="outline" onClick={onClick}>
			<div className="flex gap-2 items-center">
				<Avatar
					className={cn('bg-secondary', getAvatarSizeStyle(AvatarSize.XS))}
				>
					<AvatarImage src={agent.image || ImgUrl.AGENT_AVATAR_ALT} />
				</Avatar>
				<span>{agent.name}</span>
			</div>
		</Button>
	);
};

export default memo(AgentHelpButton);
