import UserCard from '@/components/profile/UserCard';
import axiosInstance from '@/lib/axios';
import { ApiUrl } from '@/lib/constants';
import { FormatResponse } from '@/types/common';
import { UserZType } from '@/types/user';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { useCallback, useEffect, useRef, useState } from 'react';
import NotFound from './NotFound';
import SearchCard from './SearchCard';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Separator } from './ui/separator';

interface Props {
	placeholder?: string;
	handleSendRequest: (userId: string) => () => Promise<void> | void;
}

const SearchUserBox: React.FC<Props> = ({ placeholder, handleSendRequest }) => {
	const [userPrefix, setUserPrefix] = useState('');
	const [matchedUsers, setMatchedUsers] = useState([] as UserZType[]);
	const searchInputRef = useRef(null);

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

	return (
		<div className="w-full h-full flex flex-col gap-4">
			<div className="w-full flex gap-2">
				<Input
					ref={searchInputRef}
					value={userPrefix}
					onChange={(e) => setUserPrefix(e.target.value)}
					placeholder={placeholder}
				/>
				<Button onClick={handleSearch}>Search</Button>
			</div>
			<Separator orientation="horizontal" />
			{matchedUsers.length !== 0 ? (
				<ScrollArea className="flex-1">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
						{matchedUsers.map((user) => (
							<SearchCard key={user.id} onClick={handleSendRequest(user.id)}>
								<UserCard user={user} />
							</SearchCard>
						))}
					</div>
				</ScrollArea>
			) : (
				<NotFound />
			)}
		</div>
	);
};

export default SearchUserBox;
