import { AvatarSize, ImgUrl } from '@/lib/constants';
import { parseFotmatedDate } from '@/lib/date';
import { UserZType } from '@/types/user';
import InfoCard from './InfoCard';

interface Props {
	user: UserZType;
	isCurrent?: boolean;
	size?: AvatarSize;
	children?: React.ReactNode;
}

const UserCard: React.FC<Props> = ({
	user,
	isCurrent = false,
	size = AvatarSize.MD,
	children,
}) => {
	return (
		<InfoCard
			image={user.image || ImgUrl.USER_AVATAR_ALT}
			name={user.name}
			description={user.description}
			createdAt={`Joined on ${parseFotmatedDate(user.createdAt!)}`}
			size={size}
			skeleton={isCurrent}
		>
			{children}
		</InfoCard>
	);
};

export default UserCard;
