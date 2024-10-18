import { DEFAULT_MODEL } from '@/lib/constants';
import { LlmModelZType } from '@/types/llm';
import { create } from 'zustand';

type llmModelStore = {
	selectedModel: LlmModelZType;
	availableModels: LlmModelZType[];
	setSelectedModel: (model: LlmModelZType) => void;
	setAvailableModels: (models: LlmModelZType[]) => void;
};

const defaultState = {
	selectedModel: DEFAULT_MODEL,
	availableModels: [] as LlmModelZType[],
};

const useLlmModelStore = create<llmModelStore>((set) => ({
	...defaultState,
	setSelectedModel: (model: LlmModelZType) => {
		set((state) => ({
			...state,
			selectedModel: model,
		}));
	},
	setAvailableModels: (models: LlmModelZType[]) => {
		set((state) => ({
			...state,
			availableModels: models,
		}));
	},
}));

export default useLlmModelStore;
