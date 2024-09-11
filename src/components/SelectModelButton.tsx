import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useLlmModelStore from '@/store/llmModelStore';
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
				<ScrollArea className="h-96">
					{availableModels.map((model) => (
						<DropdownMenuItem
							key={model.provider + model.model}
							onClick={() => onSelectedModelChange(model)}
						>
							<div className="w-full flex justify-between items-center gap-2">
								{`${model.model}(${model.provider})`}
								{selectedModel.provider === model.provider &&
									selectedModel.model === model.model && (
										<CheckIcon className="icon-size" />
									)}
							</div>
						</DropdownMenuItem>
					))}
					<ScrollBar orientation="vertical" />
				</ScrollArea>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default SelectModelButton;
