import { FriendshipZType, UserProfileZType } from '@/types/user';
import { create } from 'zustand';

interface UserStore {
	user: UserProfileZType | null;
	setProfile: (user: UserProfileZType) => void;
	updateProfile: (user: UserProfileZType) => void;
	clearProfile: () => void;
	newFriendship: (friendship: FriendshipZType) => void;
	removeFriendship: (friendshipId: string) => void;
}

const defaultState = {
	user: null,
};

const useUserStore = create<UserStore>((set) => ({
	...defaultState,
	setProfile: (user: UserProfileZType) =>
		set((state) => ({
			...state,
			user,
		})),
	updateProfile: (user: UserProfileZType) =>
		set((state) => ({
			...state,
			user: {
				...state.user,
				...user,
			},
		})),
	clearProfile: () =>
		set((state) => ({
			...state,
			...defaultState,
		})),
	newFriendship: (friendship: FriendshipZType) =>
		set((state) => ({
			...state,
			user: {
				...state.user!,
				friendships: [friendship, ...state.user!.friendships],
			},
		})),
	removeFriendship: (friendshipId: string) =>
		set((state) => ({
			...state,
			user: {
				...state.user!,
				friendships: state.user!.friendships.filter(
					(item) => item.id !== friendshipId
				),
			},
		})),
}));

export default useUserStore;
