'use client';

import { Badge } from '@/components/ui/badge';
import { ImgUrl, PageUrl } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { ChannelZType } from '@/types/chat';
import LinkTab from './LinkTab';

interface Props {
	channel: ChannelZType;
}

const ChannelLink: React.FC<Props> = ({ channel }) => {
	return (
		<LinkTab
			href={PageUrl.CHANNELS + '/' + channel.id}
			image={channel.image || ImgUrl.CHANNEL_AVATAR_ALT}
			title={channel.name || ' '}
			description={
				<Badge
					className={cn(
						'w-16 justify-center',
						channel.type === 'PRIVATE' ? 'bg-secondary' : 'bg-primary'
					)}
				>
					{channel.type}
				</Badge>
			}
		/>
	);
};

export default ChannelLink;
