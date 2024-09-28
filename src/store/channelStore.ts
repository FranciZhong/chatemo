import {
	ChannelMembershipZType,
	ChannelMessageZType,
	ChannelZType,
} from '@/types/chat';
import { ParentChildIdPayload } from '@/types/common';
import { create } from 'zustand';

type ChannelStore = {
	channels: ChannelZType[];
	setChannels: (channels: ChannelZType[]) => void;
	newChannel: (channel: ChannelZType) => void;
	updateChannel: (channel: ChannelZType) => void;
	removeChannel: (channelId: string) => void;
	newMembership: (membership: ChannelMembershipZType) => void;
	removeMembership: (channelId: string, membershipId: string) => void;
	pushMessages: (channelId: string, messages: ChannelMessageZType[]) => void;
	newMessage: (message: ChannelMessageZType) => void;
	updateMessage: (message: ChannelMessageZType) => void;
	removeMessage: (payload: ParentChildIdPayload) => void;
};

const defaultState = {
	channels: [] as ChannelZType[],
};

const useChannelStore = create<ChannelStore>((set) => ({
	...defaultState,
	setChannels: (channels: ChannelZType[]) => {
		set((state) => ({
			...state,
			channels,
		}));
	},

	newChannel: (channel: ChannelZType) => {
		set((state) => ({
			...state,
			channels: [channel, ...state.channels],
		}));
	},

	updateChannel: (channel: ChannelZType) => {
		set((state) => ({
			...state,
			channels: [
				...state.channels.map((item) => {
					if (item.id === channel.id) {
						return {
							...item,
							...channel,
						};
					} else {
						return item;
					}
				}),
			],
		}));
	},

	removeChannel: (channelId: string) => {
		set((state) => ({
			...state,
			channels: state.channels.filter((item) => item.id !== channelId),
		}));
	},

	newMembership: (membership: ChannelMembershipZType) => {
		set((state) => ({
			...state,
			channels: state.channels.map((channel) =>
				channel.id === membership.channelId
					? {
							...channel,
							memberships: [membership, ...(channel.memberships || [])],
					  }
					: channel
			),
		}));
	},
	removeMembership: (channelId: string, membershipId: string) => {
		set((state) => ({
			...state,
			channels: state.channels.map((channel) =>
				channel.id === channelId
					? {
							...channel,
							memberships: channel.memberships?.filter(
								(item) => item.id !== membershipId
							),
					  }
					: channel
			),
		}));
	},

	pushMessages: (channelId: string, messages: ChannelMessageZType[]) => {
		set((state) => ({
			...state,
			channels: [
				...state.channels
					.filter((channel) => channel.id === channelId)
					.map((channel) => {
						const messageIdSet = new Set(
							channel.messages?.map((item) => item.id)
						);

						return {
							...channel,
							messages: [
								...(channel.messages || []),
								...messages.filter((item) => !messageIdSet.has(item.id)),
							],
						};
					}),
				...state.channels.filter((item) => item.id !== channelId),
			],
		}));
	},

	newMessage: (message: ChannelMessageZType) => {
		set((state) => ({
			...state,
			channels: [
				...state.channels
					.filter((channel) => channel.id === message.channelId)
					.map((channel) => ({
						...channel,
						messages: [
							message,
							...(channel.messages?.filter((item) => item.id !== message.id) ||
								[]),
						],
					})),
				...state.channels.filter((item) => item.id !== message.channelId),
			],
		}));
	},

	updateMessage: (message: ChannelMessageZType) => {
		set((state) => ({
			...state,
			channels: [
				...state.channels
					.filter((channel) => channel.id === message.channelId)
					.map((channel) => ({
						...channel,
						messages: channel.messages?.map((item) => {
							return item.id === message.id ? message : item;
						}) || [message],
					})),
				...state.channels.filter((item) => item.id !== message.channelId),
			],
		}));
	},

	removeMessage: (payload: ParentChildIdPayload) => {
		set((state) => ({
			...state,
			channels: [
				...state.channels
					.filter((channel) => channel.id === payload.parentId)
					.map((channel) => ({
						...channel,
						messages: channel.messages?.filter(
							(item) => item.id !== payload.childId
						),
					})),
				...state.channels.filter((channel) => channel.id !== payload.parentId),
			],
		}));
	},
}));

export default useChannelStore;
