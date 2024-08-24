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
export const useInModalStore = () =>
	useModalStore((state) => ({
		isOpen: state.isOpen,
		modalType: state.modalType,
		secondaryType: state.secondaryType,
		closeModal: state.closeModal,
	}));
export default useModalStore;
