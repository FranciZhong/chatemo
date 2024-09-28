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
import { CheckIcon, CubeIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import IconButton from './IconButton';
import { ScrollArea, ScrollBar } from './ui/scroll-area';

interface Props {
	selectedModel: LlmModelZType;
	onSelectedModelChange: (model: LlmModelZType) => void;
}

const SelectModelButton: React.FC<Props> = ({
	selectedModel,
	onSelectedModelChange,
}) => {
	const { availableModels } = useLlmModelStore();
	const { openModal } = useModalStore();
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (open) {
		}
	}, [open]);

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild>
				<IconButton onClick={() => setOpen((value) => !value)}>
					<CubeIcon className="icon-size" />
				</IconButton>
			</DropdownMenuTrigger>
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
									{`${model.model}(${model.provider})`}
								</div>
								<div className="col-span-1">
									{selectedModel.provider === model.provider &&
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
