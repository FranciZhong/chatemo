import { cn } from '@/lib/utils';
import { useCallback } from 'react';
import { Skeleton } from '../ui/skeleton';

interface Props {
	className?: string;
}

const LoadingContent: React.FC<Props> = ({ className }) => {
	const dot = useCallback(
		() => <div className="h-1 w-1 rounded-full bg-secondary" />,
		[]
	);

	return (
		<Skeleton className={cn('flex items-center gap-1', className)}>
			{dot()}
			{dot()}
			{dot()}
		</Skeleton>
	);
};

export default LoadingContent;
