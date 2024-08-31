import { ConversationZType, MessageWithReplyZType } from '@/types/chat';
import { create } from 'zustand';

type ConversationStore = {
	conversations: ConversationZType[];
	setConversations: (conversations: ConversationZType[]) => void;
	newConversation: (conversation: ConversationZType) => void;
	updateConversation: (conversation: ConversationZType) => void;
	removeConversation: (conversationId: string) => void;
	newMessage: (message: MessageWithReplyZType) => void;
};

const defaultState = {
	conversations: [] as ConversationZType[],
};

const useConversationStore = create<ConversationStore>((set) => ({
	...defaultState,
	setConversations: (conversations: ConversationZType[]) => {
		set((state) => ({
			...state,
			conversations,
		}));
	},
	newConversation: (conversation: ConversationZType) => {
		set((state) => ({
			...state,
			conversations: [conversation, ...state.conversations],
		}));
	},
	updateConversation: (conversation: ConversationZType) => {
		set((state) => ({
			...state,
			conversations: [
				...state.conversations.map((item) => {
					if (item.id === conversation.id) {
						return { ...item, ...conversation };
					} else {
						return item;
					}
				}),
			],
		}));
	},
	removeConversation: (conversationId: string) => {
		set((state) => ({
			...state,
			conversations: state.conversations.filter(
				(item) => item.id !== conversationId
			),
		}));
	},
	newMessage: (message: MessageWithReplyZType) => {
		set((state) => ({
			...state,
			conversations: [
				...state.conversations
					.filter((conversation) => conversation.id === message.conversationId)
					.map((conversation) => ({
						...conversation,
						messages: [
							message,
							...(conversation.messages?.filter(
								(item) => item.id !== message.id
							) || []),
						],
					})),
				...state.conversations.filter(
					(item) => item.id !== message.conversationId
				),
			],
		}));
	},
}));

export default useConversationStore;
