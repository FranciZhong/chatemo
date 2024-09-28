'use client';

import { cn } from '@/lib/utils';
import React, { forwardRef } from 'react';

interface Props {
	children: React.ReactNode;
	onClick?: () => void;
	className?: string;
}

const IconButton = forwardRef<HTMLButtonElement, Props>(
	({ children, onClick, className }, ref) => {
		return (
			<button
				ref={ref}
				className={cn('icon-button', className)}
				onClick={onClick}
			>
				{children}
			</button>
		);
	}
);

IconButton.displayName = 'IconButton';

export default IconButton;
