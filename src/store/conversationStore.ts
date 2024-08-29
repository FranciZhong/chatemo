import { ConversationZType } from '@/types/chat';
import { create } from 'zustand';

type ConversationStore = {
	conversations: ConversationZType[];
	setConversations: (conversations: ConversationZType[]) => void;
	newConversation: (conversation: ConversationZType) => void;
	removeConversation: (conversationId: string) => void;
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
	removeConversation: (conversationId: string) => {
		set((state) => ({
			...state,
			conversations: state.conversations.filter(
				(item) => item.id !== conversationId
			),
		}));
	},
}));

export default useConversationStore;
