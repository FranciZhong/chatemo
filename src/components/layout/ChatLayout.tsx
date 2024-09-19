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
	ChannelMessageZType,
	ChannelZType,
	ConversationMessageZType,
	ConversationZType,
} from '@/types/chat';
import { ParentChildIdPayload } from '@/types/common';
import { AgentZType, LlmModelZType } from '@/types/llm';
import { NotificationZType, UserProfileZType } from '@/types/user';
import { useEffect, useState } from 'react';
import LoadingPage from '../LoadingPage';
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
	const { socket, connect } = useSocketStore();
	const { user, setProfile } = useUserStore();
	const { setNotifications, pushNotification } = useNotificationStore();
	const {
		setConversations,
		newConversation,
		newMessage: newConversationMessage,
		updateMessage: updateConversationMessage,
		removeMessage: removeConversationMessage,
	} = useConversationStore();
	const { setAgents } = useAgentStore();
	const {
		setChannels,
		newChannel,
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
	}, [props, setProfile, setNotifications]);

	// init socket and event listeners
	useEffect(() => {
		if (!socket) {
			connect(process.env.HOSTNAME || 'localhost:3000');
		} else {
			socket.on(UserEvent.ERROR_ACCTION, (error: string) => {
				toast({
					title: 'Error',
					description: error,
				});
			});
			socket.on(UserEvent.NEW_NOTIFICATION, (payload: NotificationZType) => {
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
			});

			// friend conversations
			socket.on(
				ConversationEvent.NEW_FRIENDSHIP,
				(payload: ConversationZType) => newConversation(payload)
			);
			socket.on(
				ConversationEvent.NEW_CONVERSATION_MESSAGE,
				(payload: ConversationMessageZType) => newConversationMessage(payload)
			);
			socket.on(
				ConversationEvent.UPDATE_CONVERSATION_MESSAGE,
				(payload: ConversationMessageZType) =>
					updateConversationMessage(payload)
			);
			socket.on(
				ConversationEvent.REMOVE_CONVERSATION_MESSAGE,
				(payload: ParentChildIdPayload) => removeConversationMessage(payload)
			);

			// channels
			socket.on(ChannelEvent.JOIN_NEW_CHANNEL, (payload: ChannelZType) => {
				newChannel(payload);
				socket.emit(ChannelEvent.JOIN_CHANNEL_ROOM, payload.id);
			});
			socket.on(
				ChannelEvent.NEW_CHANNEL_MEMBERSHIP,
				(payload: ChannelMembershipZType) => {
					newMembership(payload);
				}
			);
			socket.on(
				ChannelEvent.REMOVE_CHANNEL_MEMBERSHIP,
				(payload: ChannelMembershipZType) => {
					if (payload.userId === user?.id) {
						removeChannel(payload.channelId);
					} else {
						removeMembership(payload.channelId, payload.id);
					}
				}
			);
			socket.on(
				ChannelEvent.NEW_CHANNEL_MESSAGE,
				(payload: ChannelMessageZType) => newChannelMessage(payload)
			);
			socket.on(
				ChannelEvent.UPDATE_CHANNEL_MESSAGE,
				(payload: ChannelMessageZType) => updateChannelMessage(payload)
			);
			socket.on(
				ChannelEvent.REMOVE_CHANNEL_MESSAGE,
				(payload: ParentChildIdPayload) => removeChannelMessage(payload)
			);

			// agents
			socket.on(AgentEvent.AVAILABLE_MODELS, (models: LlmModelZType[]) => {
				setAvailableModels(models);
			});
		}
	}, [socket, connect]);

	if (isLoading) {
		return <LoadingPage />;
	}

	return (
		<>
			<NavModal />
			<ProfileModal />
			<NotificationModal />
			<MembershipsModal />
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
