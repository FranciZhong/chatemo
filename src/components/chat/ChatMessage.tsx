import { ImgUrl } from '@/lib/constants';
import { cn } from '@/lib/utils';
import useUserStore from '@/store/userStore';
import { MessageWithReplyZType } from '@/types/chat';
import { UserZType } from '@/types/user';
import { Avatar, AvatarImage } from '../ui/avatar';

interface Props {
	sender: UserZType;
	message: MessageWithReplyZType;
}

const ChatMessage: React.FC<Props> = ({ sender, message }) => {
	const { user } = useUserStore();
	const isCurrentUser = user?.id === sender.id;

	return (
		<div
			className={cn(
				'w-full flex',
				isCurrentUser ? 'justify-end' : 'justify-start'
			)}
		>
			<div
				className={cn(
					'flex gap-2 items-start',
					isCurrentUser ? 'flex-row-reverse' : ''
				)}
			>
				<Avatar className="h-8 w-8 bg-secondary">
					<AvatarImage src={sender?.image || ImgUrl.USER_AVATAR_ALT} />
				</Avatar>
				<div
					className={cn(
						'flex flex-col gap-1',
						isCurrentUser ? 'items-end' : 'items-start'
					)}
				>
					<div className="text-lg font-bold">{sender?.name}</div>
					<div className="p-2 max-w-[320px] md:max-w-[480px] lg:max-w-[640px] xl:max-w-[900px] rounded-lg bg-hover text-md">
						<p className="break-words break-all">{message.content}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChatMessage;
