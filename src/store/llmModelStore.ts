import { LlmModelZType } from '@/types/llm';
import { create } from 'zustand';

type llmModelStore = {
	availableModels: LlmModelZType[];
	setAvailableModels: (models: LlmModelZType[]) => void;
};

const defaultState = {
	availableModels: [] as LlmModelZType[],
};

const useLlmModelStore = create<llmModelStore>((set) => ({
	...defaultState,
	setAvailableModels: (models: LlmModelZType[]) => {
		set((state) => ({
			...state,
			availableModels: models,
		}));
	},
}));

export default useLlmModelStore;
