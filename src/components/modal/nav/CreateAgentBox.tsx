'use client';

import { toast } from '@/components/ui/use-toast';
import axiosInstance from '@/lib/axios';
import { ApiUrl, NavModalTab, TOAST_ERROR_DEFAULT } from '@/lib/constants';
import useAgentStore from '@/store/agentStore';
import useModalStore from '@/store/modalStore';
import { FormatResponse } from '@/types/common';
import {
	AgentProfilePayload,
	AgentProfilePayloadSchema,
	AgentZType,
} from '@/types/llm';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import AgentProfileForm from '../form/AgentProfileForm';

const CreateAgentBox: React.FC = () => {
	const { newAgent } = useAgentStore();
	const { closeModal } = useModalStore();

	const form = useForm<AgentProfilePayload>({
		resolver: zodResolver(AgentProfilePayloadSchema),
		defaultValues: {
			name: '',
			image: '',
			description: '',
		},
	});

	const image = form.watch('image');

	const handleSubmit = async (values: AgentProfilePayload) => {
		try {
			const response = await axiosInstance.post<FormatResponse<AgentZType>>(
				ApiUrl.CREATE_AGENT,
				values
			);

			const agent = response.data.data;
			if (agent) {
				newAgent(agent);
				closeModal();
			}
		} catch (error) {
			toast(TOAST_ERROR_DEFAULT);
		}
	};

	return (
		<div className="flex flex-col gap-8">
			<h2 className="heading">{NavModalTab.ADD_AGENT.toLocaleUpperCase()}</h2>
			<AgentProfileForm onSubmit={handleSubmit} buttonText="Create" />
		</div>
	);
};

export default CreateAgentBox;
