import { ImgUrl } from '@/lib/constants';
import { parseFotmatedDate } from '@/lib/date';
import { ChannelZType } from '@/types/chat';
import InfoCard from './InfoCard';

interface Props {
	channel: ChannelZType;
}

const ChannelCard: React.FC<Props> = ({ channel }) => {
	return (
		<InfoCard
			image={channel.image || ImgUrl.CHANNEL_AVATAR_ALT}
			name={channel.name}
			description={channel.description}
			createdAt={`Created on ${parseFotmatedDate(channel.createdAt!)}`}
		/>
	);
};

export default ChannelCard;
