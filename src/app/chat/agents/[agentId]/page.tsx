'use server';

import AgentBox from '@/components/chat/AgentBox';
import NavTopbar from '@/components/layout/NavTopbar';
import { Separator } from '@/components/ui/separator';

interface Props {
	params: {
		agentId: string;
	};
}

const page: React.FC<Props> = async ({ params: { agentId } }) => {
	return (
		<div className="h-full w-full flex flex-col">
			<NavTopbar />
			<Separator orientation="horizontal" />
			<div className="flex-1 overflow-hidden">
				<AgentBox agentId={agentId} />
			</div>
		</div>
	);
};

export default page;
