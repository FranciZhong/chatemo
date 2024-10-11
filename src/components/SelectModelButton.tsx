import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ModalType, ProfileModalTab } from '@/lib/constants';
import useLlmModelStore from '@/store/llmModelStore';
import useModalStore from '@/store/modalStore';
import { LlmModelZType } from '@/types/llm';
import { CaretSortIcon, CheckIcon, CubeIcon } from '@radix-ui/react-icons';
import { useCallback, useState } from 'react';
import IconButton from './IconButton';
import { Button } from './ui/button';
import { ScrollArea, ScrollBar } from './ui/scroll-area';

interface Props {
	onSelectedModelChange: (model: LlmModelZType) => void;
	variant?: 'icon' | 'config';
	selectedModel?: LlmModelZType | null;
}

const SelectModelButton: React.FC<Props> = ({
	onSelectedModelChange,
	variant = 'icon',
	selectedModel,
}) => {
	const { availableModels } = useLlmModelStore();
	const { openModal } = useModalStore();
	const [open, setOpen] = useState(false);

	const getTriggerComponent = useCallback(() => {
		if (variant === 'config') {
			return (
				<Button
					variant="outline"
					role="combobox"
					className="w-full hover:bg-hover hover:text-secondary flex justify-between gap-2"
				>
					{selectedModel
						? `${selectedModel.provider} - ${selectedModel.model}`
						: 'None'}
					<CaretSortIcon className="icon-size opacity-50" />
				</Button>
			);
		}

		return (
			<IconButton onClick={() => setOpen((value) => !value)}>
				<CubeIcon className="icon-size" />
			</IconButton>
		);
	}, [variant, selectedModel]);

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild>{getTriggerComponent()}</DropdownMenuTrigger>
			<DropdownMenuContent>
				{availableModels.length > 0 ? (
					<ScrollArea className="h-96 w-80">
						{availableModels.map((model) => (
							<DropdownMenuItem
								className="grid grid-cols-8"
								key={model.provider + model.model}
								onClick={() => onSelectedModelChange(model)}
							>
								<div className="col-span-7 text-single-line">
									{`${model.model} (${model.provider})`}
								</div>
								<div className="col-span-1">
									{selectedModel &&
										selectedModel.provider === model.provider &&
										selectedModel.model === model.model && (
											<CheckIcon className="icon-size" />
										)}
								</div>
							</DropdownMenuItem>
						))}
						<ScrollBar orientation="vertical" />
					</ScrollArea>
				) : (
					<DropdownMenuItem
						onClick={() =>
							openModal(ModalType.PROFILE_MODAL, ProfileModalTab.API_KEYS)
						}
					>
						<p>Check apikey configuration</p>
					</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default SelectModelButton;
