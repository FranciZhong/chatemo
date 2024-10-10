'use client';

import axiosInstance from '@/lib/axios';
import { ApiUrl, ModalType, TOAST_ERROR_DEFAULT } from '@/lib/constants';
import useAgentStore from '@/store/agentStore';
import useModalStore from '@/store/modalStore';
import { FormatResponse } from '@/types/common';
import { AgentConfigPayload, AgentZType, ModelConfigZType } from '@/types/llm';
import { useParams } from 'next/navigation';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { toast } from '../ui/use-toast';
import ModelConfigForm from './form/ModelConfigForm';
import Modal from './Modal';

type ParamsType = {
	agentId: string;
};

const AgentSettingModal: React.FC = () => {
	const params = useParams<ParamsType>();
	const { isOpen, modalType, closeModal } = useModalStore();
	const { agents, updateAgent } = useAgentStore();

	if (!isOpen || modalType !== ModalType.AGENT_SETTING_MODAL) {
		return null;
	}

	if (!params) {
		return null;
	}

	const agent = agents.find((item) => item.id === params.agentId);
	if (!agent) {
		return null;
	}

	const handleSubmit = async (values: ModelConfigZType) => {
		try {
			const response = await axiosInstance.post<FormatResponse<AgentZType>>(
				ApiUrl.UPDATE_AGENT_CONFIG,
				{
					agentId: params.agentId,
					config: values,
				} as AgentConfigPayload
			);

			const agent = response.data.data!;
			updateAgent(agent);
		} catch (error) {
			toast(TOAST_ERROR_DEFAULT);
		}
	};

	return (
		<Modal
			open={isOpen}
			onClose={closeModal}
			justifyContent="end"
			className="max-w-md"
			topLeft={<h1 className="p-2 text-2xl">Agent Information</h1>}
		>
			<ScrollArea className="w-full h-full">
				<div className="p-4 flex flex-col gap-8">
					<div>Meta area</div>
					<Separator />
					<h1 className="text-2xl">Customize Model Behaviors</h1>
					<div>
						<ModelConfigForm
							modelConfig={agent.config}
							onSubmit={handleSubmit}
						/>
					</div>
				</div>
			</ScrollArea>
		</Modal>
	);
};

export default AgentSettingModal;
