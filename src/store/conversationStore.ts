import { ConversationMessageZType, ConversationZType } from '@/types/chat';
import { ParentChildIdPayload } from '@/types/common';
import { create } from 'zustand';

type ConversationStore = {
	conversations: ConversationZType[];
	setConversations: (conversations: ConversationZType[]) => void;
	newConversation: (conversation: ConversationZType) => void;
	updateConversation: (conversation: ConversationZType) => void;
	removeConversation: (conversationId: string) => void;
	newMessage: (message: ConversationMessageZType) => void;
	updateMessage: (message: ConversationMessageZType) => void;
	removeMessage: (payload: ParentChildIdPayload) => void;
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
						return {
							...item,
							...conversation,
						};
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

	newMessage: (message: ConversationMessageZType) => {
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

	updateMessage: (message: ConversationMessageZType) => {
		set((state) => ({
			...state,
			conversations: [
				...state.conversations
					.filter((conversation) => conversation.id === message.conversationId)
					.map((conversation) => ({
						...conversation,
						messages: conversation.messages?.map((item) => {
							return item.id === message.id ? message : item;
						}) || [message],
					})),
				...state.conversations.filter(
					(item) => item.id !== message.conversationId
				),
			],
		}));
	},

	removeMessage: (payload: ParentChildIdPayload) => {
		set((state) => ({
			...state,
			conversations: [
				...state.conversations
					.filter((conversation) => conversation.id === payload.parentId)
					.map((conversation) => ({
						...conversation,
						messages: conversation.messages?.filter(
							(item) => item.id !== payload.childId
						),
					})),
				...state.conversations.filter(
					(conversation) => conversation.id !== payload.parentId
				),
			],
		}));
	},
}));

export default useConversationStore;
