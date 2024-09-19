import UserCard from '@/components/profile/UserCard';
import { useToast } from '@/components/ui/use-toast';
import axiosInstance from '@/lib/axios';
import { ApiUrl, NavModalTab } from '@/lib/constants';
import { FormatResponse, IdPayload } from '@/types/common';
import { UserZType } from '@/types/user';
import { useCallback, useEffect, useRef, useState } from 'react';
import NotFound from '../../NotFound';
import SearchCard from '../../SearchCard';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Separator } from '../../ui/separator';

const FindFriendBox: React.FC = () => {
	const [userPrefix, setUserPrefix] = useState('');
	const [matchedUsers, setMatchedUsers] = useState([] as UserZType[]);
	const searchInputRef = useRef(null);
	const { toast } = useToast();

	const handleSearch = useCallback(async () => {
		if (!userPrefix) {
			setMatchedUsers([]);
			return;
		}

		const response = await axiosInstance.get<FormatResponse<UserZType[]>>(
			ApiUrl.USER_SEARCH,
			{
				params: {
					name: userPrefix,
				},
			}
		);

		const res = response.data;

		// handle response error / message from server

		if (res.data) {
			setMatchedUsers(res.data);
		}
	}, [userPrefix]);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (
				event.key === 'Enter' &&
				document.activeElement === searchInputRef.current
			) {
				handleSearch();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [handleSearch]);

	const handleSendRequest = (referToId: string) => async () => {
		// todo if use dialog for description
		try {
			await axiosInstance.post<FormatResponse<any>>(
				ApiUrl.SEND_FRIEND_REQUEST,
				{ referToId } as IdPayload
			);
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Something went wrong.',
			});
		}
	};

	return (
		<div className="w-full flex flex-col gap-4">
			<h2 className="heading">{NavModalTab.FIND_FRIEND.toLocaleUpperCase()}</h2>
			<p className="text-md text-muted-foreground">
				You can add friends with their username on Chatemo.
			</p>
			<div className="w-full flex gap-2">
				<Input
					ref={searchInputRef}
					value={userPrefix}
					onChange={(e) => setUserPrefix(e.target.value)}
					placeholder="Type a friend name starting with..."
				/>
				<Button onClick={handleSearch}>Search</Button>
			</div>
			<Separator orientation="horizontal" />
			{matchedUsers.length !== 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
					{matchedUsers.map((user) => (
						<SearchCard key={user.id} onClick={handleSendRequest(user.id)}>
							<UserCard user={user} />
						</SearchCard>
					))}
				</div>
			) : (
				<NotFound />
			)}
		</div>
	);
};

export default FindFriendBox;
