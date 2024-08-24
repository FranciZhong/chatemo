import { ImgUrl } from '@/app/constants';
import { Avatar, AvatarImage } from '../ui/avatar';

interface Props {}

const ChatMessage: React.FC<Props> = ({}) => {
	return (
		<div className="flex gap-2 items-start">
			<Avatar className="h-8 w-8 rounded-full bg-secondary">
				<AvatarImage className="rounded-full" src={ImgUrl.USER_AVATAR_ALT} />
			</Avatar>
			<div className="flex flex-col gap-1">
				<div className="text-lg font-bold">username</div>
				<div className="p-2 max-w-[320px] md:max-w-[480px] lg:max-w-[640px] rounded-lg bg-hover text-md">
					{'Hello!! How are you going?'}
				</div>
			</div>
		</div>
	);
};

export default ChatMessage;
