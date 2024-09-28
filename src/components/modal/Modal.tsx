import { cn } from '@/lib/utils';
import { Cross1Icon } from '@radix-ui/react-icons';
import IconButton from '../IconButton';

export interface ModalProps {
	open: boolean;
	onClose: () => void;
	topLeft?: React.ReactNode;
	children?: React.ReactNode;
	justifyContent?: 'start' | 'center' | 'end';
	className?: string;
}

const Modal: React.FC<ModalProps> = ({
	open,
	onClose,
	topLeft,
	children,
	justifyContent,
	className,
}) => {
	if (!open) {
		return null;
	}

	return (
		<div
			className={cn(
				'absolute h-screen w-screen z-10 flex justify-center bg-neutral-800/80',
				justifyContent === 'start' && 'justify-start',
				justifyContent === 'end' && 'justify-end'
			)}
		>
			<div
				className={cn(
					'h-full w-full max-w-screen-lg rounded-xl p-2 bg-background flex flex-col gap-2',
					className
				)}
			>
				<div className="w-full flex justify-end">
					<div className="flex-1 flex justify-start">{topLeft}</div>
					<IconButton onClick={onClose}>
						<Cross1Icon />
					</IconButton>
				</div>
				<div className="flex-1 overflow-hidden">{children}</div>
			</div>
		</div>
	);
};

export default Modal;
