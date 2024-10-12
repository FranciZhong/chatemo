'use client';

import { ModalType } from '@/lib/constants';
import {
	AgentEvent,
	ChannelEvent,
	ConversationEvent,
	UserEvent,
} from '@/lib/events';
import useAgentStore from '@/store/agentStore';
import useChannelStore from '@/store/channelStore';
import useConversationStore from '@/store/conversationStore';
import useLlmModelStore from '@/store/llmModelStore';
import useModalStore from '@/store/modalStore';
import useNotificationStore from '@/store/notificationStore';
import useSocketStore from '@/store/socketStore';
import useUserStore from '@/store/userStore';
import {
	ChannelMembershipZType,
	ChannelZType,
	ConversationZType,
} from '@/types/chat';
import { AgentZType } from '@/types/llm';
import {
	FriendshipZType,
	NotificationZType,
	UserProfileZType,
} from '@/types/user';
import { useEffect, useState } from 'react';
import LoadingPage from '../LoadingPage';
import AgentSettingModal from '../modal/AgentSettingModal';
import ChannelInviteModal from '../modal/ChannelInviteModal';
import ChannelSettingModal from '../modal/ChannelSettingModal';
import MembershipsModal from '../modal/MembershipsModal';
import NavModal from '../modal/NavModal';
import NotificationModal from '../modal/NotificationModal';
import ProfileModal from '../modal/ProfileModal';
import { Separator } from '../ui/separator';
import { ToastAction } from '../ui/toast';
import { useToast } from '../ui/use-toast';
import NavSidebar from './NavSidebar';

interface Props {
	userProfile: UserProfileZType;
	notifications: NotificationZType[];
	conversations: ConversationZType[];
	agents: AgentZType[];
	channels: ChannelZType[];
	children: React.ReactNode;
}

const ChatLayout: React.FC<Props> = (props) => {
	const [isLoading, setLoading] = useState(true);
	const { socket, connect, disconnect } = useSocketStore();
	const { user, setProfile, newFriendship, removeFriendship } = useUserStore();
	const { setNotifications, pushNotification } = useNotificationStore();
	const {
		setConversations,
		newConversation,
		removeConversation,
		newMessage: newConversationMessage,
		updateMessage: updateConversationMessage,
		removeMessage: removeConversationMessage,
	} = useConversationStore();
	const { setAgents } = useAgentStore();
	const {
		setChannels,
		newChannel,
		updateChannel,
		removeChannel,
		newMembership,
		removeMembership,
		newMessage: newChannelMessage,
		updateMessage: updateChannelMessage,
		removeMessage: removeChannelMessage,
	} = useChannelStore();
	const { toast } = useToast();
	const { openModal } = useModalStore();
	const { setAvailableModels } = useLlmModelStore();

	useEffect(() => {
		setLoading(false);
	}, []);

	// init stores
	useEffect(() => {
		setProfile(props.userProfile);
		setNotifications(props.notifications);
		setConversations(props.conversations);
		setAgents(props.agents);
		setChannels(props.channels);
	}, [
		props,
		setProfile,
		setNotifications,
		setConversations,
		setAgents,
		setChannels,
	]);

	// init socket and event listeners
	useEffect(() => {
		if (window) {
			connect(window.location.host);
		}

		return () => disconnect();
	}, [connect, disconnect]);

	useEffect(() => {
		if (!socket) {
			return;
		}

		const handleErrorAction = (error: string) => {
			toast({
				title: 'Error',
				description: error,
			});
		};

		const handleNewNotification = (payload: NotificationZType) => {
			pushNotification(payload);
			toast({
				title: payload.type,
				description: 'Check your notification box.',
				action: (
					<ToastAction
						onClick={() => openModal(ModalType.NOTIFICATION_MODAL)}
						altText="Details"
					>
						Details
					</ToastAction>
				),
			});
		};

		socket.on(UserEvent.ERROR_ACCTION, handleErrorAction);
		socket.on(UserEvent.NEW_NOTIFICATION, handleNewNotification);

		return () => {
			socket.off(UserEvent.ERROR_ACCTION, handleErrorAction);
			socket.off(UserEvent.NEW_NOTIFICATION, handleNewNotification);
		};
	}, [socket, toast, pushNotification, openModal]);

	// friend conversations listeners
	useEffect(() => {
		if (!socket) {
			return;
		}

		const handleNewFriendship = (payload: ConversationZType) => {
			newConversation(payload);
			payload.friendships
				?.filter((friendship) => friendship.userId === user?.id)
				.forEach((friendship) => newFriendship(friendship));
		};

		const handleRemoveFriendship = (payload: FriendshipZType) => {
			removeConversation(payload.conversationId);
			removeFriendship(payload.id);
		};

		socket.on(ConversationEvent.NEW_FRIENDSHIP, handleNewFriendship);
		socket.on(ConversationEvent.REMOVE_FRIENDSHIP, handleRemoveFriendship);
		socket.on(
			ConversationEvent.NEW_CONVERSATION_MESSAGE,
			newConversationMessage
		);
		socket.on(
			ConversationEvent.UPDATE_CONVERSATION_MESSAGE,
			updateConversationMessage
		);
		socket.on(
			ConversationEvent.REMOVE_CONVERSATION_MESSAGE,
			removeConversationMessage
		);

		return () => {
			socket.off(ConversationEvent.NEW_FRIENDSHIP, handleNewFriendship);
			socket.off(ConversationEvent.REMOVE_FRIENDSHIP, handleRemoveFriendship);
			socket.off(
				ConversationEvent.NEW_CONVERSATION_MESSAGE,
				newConversationMessage
			);
			socket.off(
				ConversationEvent.UPDATE_CONVERSATION_MESSAGE,
				updateConversationMessage
			);
			socket.off(
				ConversationEvent.REMOVE_CONVERSATION_MESSAGE,
				removeConversationMessage
			);
		};
	}, [
		socket,
		user?.id,
		newFriendship,
		removeFriendship,
		newConversation,
		removeConversation,
		newConversationMessage,
		updateConversationMessage,
		removeConversationMessage,
	]);

	// channels listeners
	useEffect(() => {
		if (!socket) {
			return;
		}

		const handleJoinNewChannel = (payload: ChannelZType) => {
			newChannel(payload);
			socket.emit(ChannelEvent.JOIN_CHANNEL_ROOM, payload.id);
		};

		const handleRemoveChannelMembership = (payload: ChannelMembershipZType) => {
			if (payload.userId === user?.id) {
				removeChannel(payload.channelId);
				socket.emit(ChannelEvent.LEAVE_CHANNEL_ROOM, payload.channelId);
			} else {
				removeMembership(payload.channelId, payload.id);
			}
		};

		socket.on(ChannelEvent.JOIN_NEW_CHANNEL, handleJoinNewChannel);
		socket.on(ChannelEvent.UPDATE_CHANNEL_META, updateChannel);
		socket.on(ChannelEvent.NEW_CHANNEL_MEMBERSHIP, newMembership);
		socket.on(
			ChannelEvent.REMOVE_CHANNEL_MEMBERSHIP,
			handleRemoveChannelMembership
		);
		socket.on(ChannelEvent.NEW_CHANNEL_MESSAGE, newChannelMessage);
		socket.on(ChannelEvent.UPDATE_CHANNEL_MESSAGE, updateChannelMessage);
		socket.on(ChannelEvent.REMOVE_CHANNEL_MESSAGE, removeChannelMessage);

		return () => {
			socket.off(ChannelEvent.JOIN_NEW_CHANNEL, handleJoinNewChannel);
			socket.off(ChannelEvent.UPDATE_CHANNEL_META, updateChannel);
			socket.off(ChannelEvent.NEW_CHANNEL_MEMBERSHIP, newMembership);
			socket.off(
				ChannelEvent.REMOVE_CHANNEL_MEMBERSHIP,
				handleRemoveChannelMembership
			);
			socket.off(ChannelEvent.NEW_CHANNEL_MESSAGE, newChannelMessage);
			socket.off(ChannelEvent.UPDATE_CHANNEL_MESSAGE, updateChannelMessage);
			socket.off(ChannelEvent.REMOVE_CHANNEL_MESSAGE, removeChannelMessage);
		};
	}, [
		socket,
		user?.id,
		newChannel,
		updateChannel,
		removeChannel,
		newMembership,
		removeMembership,
		newChannelMessage,
		updateChannelMessage,
		removeChannelMessage,
	]);

	// agent listeners
	useEffect(() => {
		if (!socket) {
			return;
		}

		socket.on(AgentEvent.AVAILABLE_MODELS, setAvailableModels);

		return () => {
			socket.off(AgentEvent.AVAILABLE_MODELS, setAvailableModels);
		};
	}, [socket, setAvailableModels]);

	if (isLoading) {
		return <LoadingPage />;
	}

	return (
		<>
			<NavModal />
			<ProfileModal />
			<NotificationModal />
			<ChannelSettingModal />
			<MembershipsModal />
			<ChannelInviteModal />
			<AgentSettingModal />
			<div className="w-screen h-screen flex">
				{/* todo window size issue */}
				<NavSidebar />
				<Separator orientation="vertical" />
				<div className="flex-1">{props.children}</div>
			</div>
		</>
	);
};

export default ChatLayout;
