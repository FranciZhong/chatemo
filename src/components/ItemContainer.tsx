'use client';

import { cn } from '@/lib/utils';

interface Props {
	children: React.ReactNode;
	className?: string;
}

const ItemContainer: React.FC<Props> = ({ children, className }) => {
	return (
		<div className={cn('rounded-md hover:bg-hover', className)}>{children}</div>
	);
};

export default ItemContainer;
