import { SidebarTab } from '@/app/constants';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ChannelList from '../chat/channel/ChannelList';
import FriendList from '../chat/friend/FriendList';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import UserBar from './UserBar';

interface Props {}

const NavSidebar: React.FC<Props> = ({}) => {
	return (
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
					<TabsContent value="friends">
						<FriendList />
					</TabsContent>
					<TabsContent value={SidebarTab.CHANNELS}>
						<ChannelList />
					</TabsContent>
					<TabsContent value={SidebarTab.AGENTS}>
						<div className="flex items-center justify-center">
							<div>TODO</div>
						</div>
					</TabsContent>
				</ScrollArea>
			</Tabs>
			<Separator orientation="horizontal" />
			<UserBar />
		</div>
	);
};

export default NavSidebar;
