import { ModalType, ProfileModalTab } from '@/lib/constants';
import TabModal from './TabModal';
import ApiKeysBox from './profile/ApiKeysBox';
import USerProfileBox from './profile/UserProfileBox';

const ProfileModal: React.FC = () => {
	const todoPage = () => (
		<div className="flex items-center justify-center">
			<div>TODO</div>
		</div>
	);

	const tab2PageMap = new Map<string, React.ReactNode>();
	tab2PageMap.set(ProfileModalTab.USER_PROFILE, <USerProfileBox />);
	tab2PageMap.set(ProfileModalTab.API_KEYS, <ApiKeysBox />);
	tab2PageMap.set(ProfileModalTab.MODEL_SETTING, todoPage());

	return (
		<TabModal
			type={ModalType.PROFILE_MODAL}
			tab2PageMap={tab2PageMap}
			defaultTab={ProfileModalTab.USER_PROFILE}
		/>
	);
};

export default ProfileModal;
