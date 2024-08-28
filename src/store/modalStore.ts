import { create } from 'zustand';

type ModalStore = {
	isOpen: boolean;
	modalType: string | null;
	secondaryType: string | null;
	openModal: (type: string, section?: string) => void;
	closeModal: () => void;
};

const defaultState = {
	isOpen: false,
	modalType: null,
	secondaryType: null,
};

const useModalStore = create<ModalStore>((set) => ({
	...defaultState,
	openModal: (type: string, section?: string) =>
		set(() => ({
			isOpen: true,
			modalType: type,
			secondaryType: section || null,
		})),
	closeModal: () => set(defaultState),
}));

export const useOpenModalStore = () =>
	useModalStore((state) => state.openModal);

export const useCloseModalStore = () =>
	useModalStore((state) => state.closeModal);

export default useModalStore;
