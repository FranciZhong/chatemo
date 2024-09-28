'use client';

import useUserStore from '@/store/userStore';
import ItemContainer from '../ItemContainer';
import UserCard from '../profile/UserCard';
import NavMenuTrigger from './NavMenuTrigger';
import SettingMenuTrigger from './SettingMenuTrigger';

const UserBar: React.FC = () => {
	const { user } = useUserStore();

	return (
		<div className="h-16 w-full px-4 flex gap-2 justify-between items-center">
			<ItemContainer className="flex-1 px-2 py-1">
				<UserCard user={user!} isCurrent={true}>
					<div className="text-secondary text-sm font-light">online</div>
				</UserCard>
			</ItemContainer>
			<div className="flex items-center gap-2">
				<NavMenuTrigger />
				<SettingMenuTrigger />
			</div>
		</div>
	);
};

export default UserBar;
