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
import { toast } from '@/components/ui/use-toast';
import axiosInstance from '@/lib/axios';
import { ApiUrl, ImgUrl, ProfileModalTab } from '@/lib/constants';
import useModalStore from '@/store/modalStore';
import useUserStore from '@/store/userStore';
import { FormatResponse } from '@/types/common';
import {
	ProfilePayload,
	ProfilePayloadSchema,
	UserProfileZType,
} from '@/types/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const USerProfileBox: React.FC = () => {
	const { user, setProfile } = useUserStore();
	const { closeModal } = useModalStore();

	const form = useForm<ProfilePayload>({
		resolver: zodResolver(ProfilePayloadSchema),
		defaultValues: {
			image: user?.image || '',
			name: user?.name || '',
			email: user?.email || '',
			description: user?.description || '',
		},
	});

	const onSubmit = async (values: ProfilePayload) => {
		try {
			const response = await axiosInstance.post<
				FormatResponse<UserProfileZType>
			>(ApiUrl.UPDATE_USER_PROFILE, values);

			const userProfile = response.data.data;
			if (userProfile) {
				setProfile(userProfile);
				closeModal();
			}
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Something went wrong.',
			});
		}
	};

	const image = form.watch('image');

	return (
		<div className="flex flex-col gap-8">
			<h2 className="heading">
				{ProfileModalTab.USER_PROFILE.toLocaleUpperCase()}
			</h2>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<AvatarUploader
						image={image || ImgUrl.USER_AVATAR_ALT}
						onChange={(url: string) => form.setValue('image', url)}
					/>

					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Username</FormLabel>
								<FormControl>
									<Input placeholder="Choose a name" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input placeholder="Email" {...field} disabled={true} />
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
									<Textarea placeholder="Introduce yourself ..." {...field} />
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

export default USerProfileBox;
