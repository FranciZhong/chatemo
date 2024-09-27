import ChannelCard from '@/components/profile/ChannelCard';
import { useToast } from '@/components/ui/use-toast';
import axiosInstance from '@/lib/axios';
import { ApiUrl, NavModalTab, TOAST_ERROR_DEFAULT } from '@/lib/constants';
import { ChannelZType } from '@/types/chat';
import { FormatResponse, IdPayload } from '@/types/common';
import { useCallback, useEffect, useRef, useState } from 'react';
import NotFound from '../../NotFound';
import SearchCard from '../../SearchCard';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Separator } from '../../ui/separator';

const JoinChannelBox: React.FC = () => {
	const [channelPrefix, setChannelPrefix] = useState('');
	const [matchedChannels, setMatchedChannels] = useState([] as ChannelZType[]);
	const searchInputRef = useRef(null);
	const { toast } = useToast();

	const handleSearch = useCallback(async () => {
		if (!channelPrefix) {
			setMatchedChannels([]);
			return;
		}

		const response = await axiosInstance.get<FormatResponse<ChannelZType[]>>(
			ApiUrl.CHANNEL_SEARCH,
			{
				params: {
					name: channelPrefix,
				},
			}
		);

		if (response.data.data) {
			setMatchedChannels(response.data.data);
		}
	}, [channelPrefix]);

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
				ApiUrl.SEND_CHANNEL_REQUEST,
				{ referToId } as IdPayload
			);
		} catch (error) {
			toast(TOAST_ERROR_DEFAULT);
		}
	};

	return (
		<div className="w-full flex flex-col gap-4">
			<h2 className="heading">
				{NavModalTab.JOIN_CHANNEL.toLocaleUpperCase()}
			</h2>
			<p className="text-md text-muted-foreground">
				You can request to join public channels.
			</p>
			<div className="w-full flex gap-2">
				<Input
					ref={searchInputRef}
					value={channelPrefix}
					onChange={(e) => setChannelPrefix(e.target.value)}
					placeholder="Type a channel name starting with..."
				/>
				<Button onClick={handleSearch}>Search</Button>
			</div>
			<Separator orientation="horizontal" />
			{matchedChannels.length !== 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
					{matchedChannels.map((channel) => (
						<SearchCard
							key={channel.id}
							onClick={handleSendRequest(channel.id)}
						>
							<ChannelCard channel={channel} />
						</SearchCard>
					))}
				</div>
			) : (
				<NotFound />
			)}
		</div>
	);
};

export default JoinChannelBox;
