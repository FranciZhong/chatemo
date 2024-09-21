import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AvatarSize, ImgUrl } from '@/lib/constants';
import { cn, getAvatarSizeStyle } from '@/lib/utils';
import useAgentStore from '@/store/agentStore';
import { AgentZType } from '@/types/llm';
import { RocketIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import IconButton from './IconButton';
import { Avatar, AvatarImage } from './ui/avatar';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import { Separator } from './ui/separator';

interface Props {
	onSelectedAgentChange: (agent: AgentZType | null) => void;
}

const SelectAgentButton: React.FC<Props> = ({ onSelectedAgentChange }) => {
	const { agents } = useAgentStore();
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (open) {
		}
	}, [open]);

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild>
				<IconButton onClick={() => setOpen((value) => !value)}>
					<RocketIcon className="icon-size" />
				</IconButton>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				{
					<ScrollArea className={cn('w-64', agents.length > 8 && 'h-80')}>
						{agents.map((agent) => (
							<DropdownMenuItem
								className="gap-2"
								key={'preview-' + agent.id}
								onClick={() => onSelectedAgentChange(agent)}
							>
								<Avatar
									className={cn(
										'bg-primary',
										getAvatarSizeStyle(AvatarSize.XS)
									)}
								>
									<AvatarImage src={agent.image || ImgUrl.AGENT_AVATAR_ALT} />
								</Avatar>
								<span className="text-single-line">{agent.name}</span>
							</DropdownMenuItem>
						))}
						<Separator orientation="horizontal" />
						<DropdownMenuItem onClick={() => onSelectedAgentChange(null)}>
							without agent
						</DropdownMenuItem>
						<ScrollBar orientation="vertical" />
					</ScrollArea>
				}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default SelectAgentButton;
