import { NotificationZType } from '@/types/user';
import { create } from 'zustand';

type NotificationStore = {
	notifications: NotificationZType[];
	setNotifications: (notifications: NotificationZType[]) => void;
	removeById: (referToId: string) => void;
	push: (notification: NotificationZType) => void;
};

const defaultStore = {
	notifications: [] as NotificationZType[],
};

const useNotificationStore = create<NotificationStore>((set) => ({
	...defaultStore,
	setNotifications: (notifications: NotificationZType[]) => {
		return set((state) => ({
			...state,
			notifications,
		}));
	},
	removeById: (referToId: string) => {
		return set((state) => ({
			...state,
			notifications: state.notifications.filter(
				(item) => item.referToId !== referToId
			),
		}));
	},
	push: (notification: NotificationZType) => {
		return set((state) => ({
			...state,
			notifications: [notification, ...state.notifications],
		}));
	},
}));

export default useNotificationStore;
