import { AgentZType } from '@/types/llm';
import { create } from 'zustand';

type AgentStore = {
	agents: AgentZType[];
	setAgents: (agents: AgentZType[]) => void;
	newAgent: (agent: AgentZType) => void;
	removeAgent: (agentId: string) => void;
	updateAgent: (agent: AgentZType) => void;
};

const defaultState = {
	agents: [] as AgentZType[],
};

const useAgentStore = create<AgentStore>((set) => ({
	...defaultState,
	setAgents: (agents: AgentZType[]) => {
		set((state) => ({
			...state,
			agents,
		}));
	},

	newAgent: (agent: AgentZType) => {
		set((state) => ({
			...state,
			agents: [agent, ...state.agents],
		}));
	},

	removeAgent: (agentId: string) => {
		set((state) => ({
			...state,
			agents: state.agents.filter((item) => item.id !== agentId),
		}));
	},

	updateAgent: (agent: AgentZType) => {
		set((state) => ({
			...state,
			agents: state.agents.map((item) =>
				item.id === agent.id
					? {
							...item,
							...agent,
					  }
					: item
			),
		}));
	},
}));

export default useAgentStore;
