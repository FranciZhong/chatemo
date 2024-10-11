import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import HoverTooltip from './HoverTooltip';

interface Props {
	label: string;
	tooltipContent: string;
}

const TooltipLabel: React.FC<Props> = ({ label, tooltipContent }) => {
	return (
		<div className="flex gap-2 items-center">
			<h6>{label}</h6>
			<HoverTooltip content={tooltipContent}>
				<QuestionMarkCircledIcon className="text-secondary opacity-80" />
			</HoverTooltip>
		</div>
	);
};

export default TooltipLabel;
