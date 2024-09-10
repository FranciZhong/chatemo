import { useCallback } from 'react';
import { Skeleton } from '../ui/skeleton';

const LoadingContent: React.FC = () => {
	const dot = useCallback(
		() => <div className="h-1 w-1 rounded-full bg-secondary" />,
		[]
	);

	return (
		<Skeleton className="flex items-center gap-1">
			{dot()}
			{dot()}
			{dot()}
		</Skeleton>
	);
};

export default LoadingContent;
