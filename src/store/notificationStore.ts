import { NotificationZType } from '@/types/user';
import { create } from 'zustand';

type NotificationStore = {
	notifications: NotificationZType[];
	setNotifications: (notifications: NotificationZType[]) => void;
	removeNotification: (referToId: string) => void;
	pushNotification: (notification: NotificationZType) => void;
};

const defaultState = {
	notifications: [] as NotificationZType[],
};

const useNotificationStore = create<NotificationStore>((set) => ({
	...defaultState,
	setNotifications: (notifications: NotificationZType[]) => {
		return set((state) => ({
			...state,
			notifications,
		}));
	},
	removeNotification: (referToId: string) => {
		return set((state) => ({
			...state,
			notifications: state.notifications.filter(
				(item) => item.referToId !== referToId
			),
		}));
	},
	pushNotification: (notification: NotificationZType) => {
		return set((state) => ({
			...state,
			notifications: [notification, ...state.notifications],
		}));
	},
}));

export default useNotificationStore;
