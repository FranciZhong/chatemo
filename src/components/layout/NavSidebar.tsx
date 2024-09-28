'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SidebarTab } from '@/lib/constants';
import useOpenStore from '@/store/openStore';
import AgentList from '../chat/AgentList';
import ChannelList from '../chat/ChannelList';
import ConversationList from '../chat/ConversationList';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import UserBar from './UserBar';

interface Props {}

const NavSidebar: React.FC<Props> = ({}) => {
	const { openSidebar } = useOpenStore();

	return openSidebar ? (
		<div className="w-full md:w-80 h-full flex flex-col justify-end">
			<Tabs
				defaultValue={SidebarTab.FRIENDS}
				className="flex-1 flex flex-col overflow-hidden"
			>
				<TabsList className="grid w-full grid-cols-3 gap-2">
					<TabsTrigger value={SidebarTab.FRIENDS}>
						{SidebarTab.FRIENDS.toUpperCase()}
					</TabsTrigger>
					<TabsTrigger value={SidebarTab.CHANNELS}>
						{SidebarTab.CHANNELS.toUpperCase()}
					</TabsTrigger>
					<TabsTrigger value={SidebarTab.AGENTS}>
						{SidebarTab.AGENTS.toUpperCase()}
					</TabsTrigger>
				</TabsList>
				<Separator orientation="horizontal" />
				<ScrollArea className="flex-1">
					<TabsContent value={SidebarTab.FRIENDS}>
						<ConversationList />
					</TabsContent>
					<TabsContent value={SidebarTab.CHANNELS}>
						<ChannelList />
					</TabsContent>
					<TabsContent value={SidebarTab.AGENTS}>
						<AgentList />
					</TabsContent>
				</ScrollArea>
			</Tabs>
			<Separator orientation="horizontal" />
			<UserBar />
		</div>
	) : null;
};

export default NavSidebar;
