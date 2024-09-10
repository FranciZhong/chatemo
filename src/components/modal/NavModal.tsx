import { ModalType, NavModalTab } from '@/lib/constants';
import TabModal from './TabModal';
import CreateAgentBox from './nav/CreateAgentBox';
import FindFriendBox from './nav/SearchFriendBox';

const NavModal: React.FC = () => {
	const todoPage = () => (
		<div className="flex items-center justify-center">
			<div>TODO</div>
		</div>
	);

	const tab2PageMap = new Map<string, React.ReactNode>();
	tab2PageMap.set(NavModalTab.FIND_FRIEND, <FindFriendBox />);
	tab2PageMap.set(NavModalTab.ADD_AGENT, <CreateAgentBox />);
	tab2PageMap.set(NavModalTab.JOIN_CHANNEL, todoPage());
	tab2PageMap.set(NavModalTab.CREATE_CHANNEL, todoPage());

	return (
		<TabModal
			type={ModalType.NAV_MODAL}
			tab2PageMap={tab2PageMap}
			defaultTab={NavModalTab.FIND_FRIEND}
		/>
	);
};

export default NavModal;
