import { UserProfileZType } from '@/types/user';
import { create } from 'zustand';

interface UserStore {
	user: UserProfileZType | null;
	setProfile: (user: UserProfileZType) => void;
	clearProfile: () => void;
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
	clearProfile: () =>
		set((state) => ({
			...state,
			...defaultState,
		})),
}));

export default useUserStore;
