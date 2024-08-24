import { ModalType, NavModalTab } from '@/app/constants';
import { useInModalStore } from '@/store/modalStore';
import { DragHandleHorizontalIcon } from '@radix-ui/react-icons';
import { useCallback, useState } from 'react';
import IconButton from '../IconButton';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import Modal from './Modal';

const NavModal: React.FC = () => {
	const { isOpen, modalType, secondaryType, closeModal } = useInModalStore();
	const [tabsOpen, setTabsOpen] = useState(true);

	const handleClickTabsTrigger = useCallback(() => {
		setTabsOpen(!tabsOpen);
	}, [tabsOpen, setTabsOpen]);

	if (!isOpen || modalType !== ModalType.NAV_MODAL) {
		return null;
	}

	return (
		<Modal
			open={true}
			onClose={closeModal}
			topLeft={
				<IconButton onClick={handleClickTabsTrigger}>
					<DragHandleHorizontalIcon className="icon-size" />
				</IconButton>
			}
		>
			<div className="h-full w-full">
				<Tabs
					defaultValue={secondaryType || NavModalTab.FIND_FRIEND}
					className="h-full w-full p-2 flex overflow-hidden"
				>
					{tabsOpen ? (
						<>
							<TabsList className="flex flex-col w-48">
								{Object.values(NavModalTab).map((value) => {
									return (
										<TabsTrigger
											key={value}
											value={value}
											className="justify-start border-none focus-visible:ring-0"
										>
											{value.toUpperCase()}
										</TabsTrigger>
									);
								})}
							</TabsList>
							<Separator orientation="vertical" />
						</>
					) : null}
					<ScrollArea className="flex-1">
						{Object.values(NavModalTab).map((value) => {
							return (
								<TabsContent key={value} value={value}>
									<div className="flex items-center justify-center">
										<div>TODO</div>
									</div>
								</TabsContent>
							);
						})}
					</ScrollArea>
				</Tabs>
			</div>
		</Modal>
	);
};

export default NavModal;
