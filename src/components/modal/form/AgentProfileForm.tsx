'use client';

import AvatarUploader from '@/components/profile/AvatarUploader';
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
import { ImgUrl } from '@/lib/constants';
import {
	AgentProfilePayload,
	AgentProfilePayloadSchema,
	AgentZType,
} from '@/types/llm';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

interface Props {
	onSubmit: (values: AgentProfilePayload) => Promise<void>;
	buttonText: string;
	defaultProfile?: AgentZType;
}

const AgentProfileForm: React.FC<Props> = ({
	onSubmit,
	buttonText,
	defaultProfile,
}) => {
	const form = useForm<AgentProfilePayload>({
		resolver: zodResolver(AgentProfilePayloadSchema),
		defaultValues: {
			name: defaultProfile?.name || '',
			image: defaultProfile?.image || '',
			description: defaultProfile?.description || '',
		},
	});

	const image = form.watch('image');

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<AvatarUploader
					image={image || ImgUrl.AGENT_AVATAR_ALT}
					onChange={(url: string) => form.setValue('image', url)}
				/>

				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input placeholder="Give a name to your new agent" {...field} />
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
					<Button type="submit">{buttonText}</Button>
				</div>
			</form>
		</Form>
	);
};

export default AgentProfileForm;
