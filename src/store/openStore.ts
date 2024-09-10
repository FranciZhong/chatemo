import { create } from 'zustand';

type OpenStore = {
	openSidebar: boolean;
	toggleOpenSidebar: () => void;
};

const defaultState = {
	openSidebar: true,
};

const useOpenStore = create<OpenStore>((set) => ({
	...defaultState,
	toggleOpenSidebar: () => {
		set((state) => ({
			...state,
			openSidebar: !state.openSidebar,
		}));
	},
}));

export default useOpenStore;
