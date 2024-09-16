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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ImgUrl } from '@/lib/constants';
import {
	ChannelPayload,
	ChannelPayloadSchema,
	ChannelZType,
} from '@/types/chat';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';

interface Props {
	channel?: ChannelZType;
	onSubmit: (values: ChannelPayload) => Promise<void>;
}

const ChannelForm: React.FC<Props> = ({ channel, onSubmit }) => {
	const form = useForm<ChannelPayload>({
		resolver: zodResolver(ChannelPayloadSchema),
		defaultValues: {
			type: channel?.type || 'PRIVATE',
			name: channel?.name || '',
			image: channel?.image || '',
			description: channel?.description || '',
		},
	});

	const image = form.watch('image');
	const type = form.watch('type');

	const handleSwitchType = useCallback(() => {
		form.setValue('type', type === 'PRIVATE' ? 'PUBLIC' : 'PRIVATE');
	}, [form, type]);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<AvatarUploader
					image={image || ImgUrl.CHANNEL_AVATAR_ALT}
					onChange={(url: string) => form.setValue('image', url)}
				/>

				<FormField
					control={form.control}
					name="type"
					render={({ field }) => (
						<FormItem className="flex items-center justify-between">
							<FormLabel>Public Channel</FormLabel>
							<FormControl>
								<Switch
									checked={field.value === 'PUBLIC'}
									onCheckedChange={handleSwitchType}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input
									placeholder="Give a name to your new channel"
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
									placeholder="A short description for your new channel"
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
	);
};

export default ChannelForm;
