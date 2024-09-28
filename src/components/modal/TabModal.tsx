import { ModalType } from '@/lib/constants';
import useModalStore from '@/store/modalStore';
import { DragHandleHorizontalIcon } from '@radix-ui/react-icons';
import { ReactNode, useCallback, useState } from 'react';
import IconButton from '../IconButton';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import Modal from './Modal';

interface Props {
	type: ModalType;
	tab2PageMap: Map<string, ReactNode>;
	defaultTab?: string;
}

const TabModal: React.FC<Props> = ({ type, tab2PageMap, defaultTab }) => {
	const { isOpen, modalType, secondaryType, closeModal } = useModalStore();
	const [tabsOpen, setTabsOpen] = useState(true);

	const handleClickTabsTrigger = useCallback(() => {
		setTabsOpen(!tabsOpen);
	}, [tabsOpen, setTabsOpen]);

	if (!isOpen || modalType !== type) {
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
					defaultValue={secondaryType || defaultTab}
					className="h-full w-full p-2 flex overflow-hidden"
				>
					{tabsOpen ? (
						<>
							<TabsList className="flex flex-col gap-1 w-48">
								{Array.from(tab2PageMap.keys()).map((value) => {
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
						<div className="px-4">
							{Array.from(tab2PageMap.entries()).map(([k, v]) => (
								<TabsContent key={k} value={k}>
									{v}
								</TabsContent>
							))}
						</div>
					</ScrollArea>
				</Tabs>
			</div>
		</Modal>
	);
};

export default TabModal;
