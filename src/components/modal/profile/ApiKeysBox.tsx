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
import { toast } from '@/components/ui/use-toast';
import axiosInstance from '@/lib/axios';
import { ApiUrl, ProfileModalTab, TOAST_ERROR_DEFAULT } from '@/lib/constants';
import { UserEvent } from '@/lib/events';
import useSocketStore from '@/store/socketStore';
import useUserStore from '@/store/userStore';
import { FormatResponse } from '@/types/common';
import {
	ApiConfigSchema,
	ApiConfigZType,
	UserProfileZType,
} from '@/types/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const ApiKeysBox: React.FC = () => {
	const { user, updateProfile } = useUserStore();
	const { socket } = useSocketStore();
	const apiConfig = user?.config?.apiConfig;

	const form = useForm<ApiConfigZType>({
		resolver: zodResolver(ApiConfigSchema),
		defaultValues: apiConfig || {
			openaiApiKey: '',
			anthropicApiKey: '',
		},
	});

	const onSubmit = async (values: ApiConfigZType) => {
		try {
			const response = await axiosInstance.post<
				FormatResponse<UserProfileZType>
			>(ApiUrl.UPDATE_APIKEYS_CONFIG, values);

			const userProfile = response.data.data!;

			updateProfile(userProfile);
			socket?.emit(UserEvent.UPDATE_APIKEYS);
		} catch (error) {
			toast(TOAST_ERROR_DEFAULT);
		}
	};

	return (
		<div className="flex flex-col gap-8">
			<h2 className="heading">
				{ProfileModalTab.API_KEYS.toLocaleUpperCase()}
			</h2>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<FormField
						control={form.control}
						name="openaiApiKey"
						render={({ field }) => (
							<FormItem>
								<FormLabel>OpenAI API Key</FormLabel>
								<FormControl>
									<Input type="password" placeholder="sk-xxx" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="anthropicApiKey"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Anthropic API Key</FormLabel>
								<FormControl>
									<Input type="password" placeholder="sk-xxx" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="geminiApiKey"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Gemini API Key</FormLabel>
								<FormControl>
									<Input type="password" placeholder="AIxxx" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="flex justify-end">
						<Button type="submit">Update</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default ApiKeysBox;
