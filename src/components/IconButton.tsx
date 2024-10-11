'use client';

import { cn } from '@/lib/utils';
import React, { forwardRef, MouseEventHandler } from 'react';

interface Props {
	children: React.ReactNode;
	onClick?: MouseEventHandler<any>;
	className?: string;
}

const IconButton = forwardRef<HTMLButtonElement, Props>(
	({ children, onClick, className }, ref) => {
		return (
			<button
				ref={ref}
				type="button"
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
