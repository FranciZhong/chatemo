'use server';

import AgentBox from '@/components/chat/AgentBox';
import AgentSettingTrigger from '@/components/layout/AgentSettingTrigger';
import NavTopbar from '@/components/layout/NavTopbar';
import { Separator } from '@/components/ui/separator';

interface Props {
	params: {
		agentId: string;
	};
}

const page: React.FC<Props> = async ({ params: { agentId } }) => {
	const NavTopTriggers: React.ReactNode[] = [
		<AgentSettingTrigger key="agent-setting-trigger" />,
	];

	return (
		<div className="h-full w-full flex flex-col">
			<NavTopbar triggers={NavTopTriggers} />
			<Separator orientation="horizontal" />
			<div className="flex-1 overflow-hidden">
				<AgentBox agentId={agentId} />
			</div>
		</div>
	);
};

export default page;
