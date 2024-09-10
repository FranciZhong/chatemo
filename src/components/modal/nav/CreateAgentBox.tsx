'use client';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import axiosInstance from '@/lib/axios';
import { ApiUrl, NavModalTab } from '@/lib/constants';
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

	const onSubmit = async (values: AgentProfilePayload) => {
		// console.log(values);
		try {
			const response = await axiosInstance.post<FormatResponse<AgentZType>>(
				ApiUrl.CREATE_AGENT,
				values
			);

			const agent = response.data.data;
			if (agent) {
				newAgent(agent);
			}
			closeModal();
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Something went wrong.',
			});
		}
	};

	return (
		<div className="flex flex-col gap-8">
			<h2 className="heading">{NavModalTab.ADD_AGENT.toLocaleUpperCase()}</h2>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input
										placeholder="Give a name to your new agent"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<Textarea
										placeholder="A short description for your new agent"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="flex justify-end">
						<Button type="submit">Create</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default CreateAgentBox;
