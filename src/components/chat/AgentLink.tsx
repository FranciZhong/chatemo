'use client';

import { ImgUrl, PageUrl } from '@/lib/constants';
import { AgentZType } from '@/types/llm';
import LinkTab from './LinkTab';

interface Props {
	agent: AgentZType;
}

const AgentLink: React.FC<Props> = ({ agent }) => {
	return (
		<LinkTab
			href={PageUrl.AGENTS + '/' + agent.id}
			image={agent.image || ImgUrl.AGENT_AVATAR_ALT}
			title={agent.name || ' '}
			description={agent.description || ' '}
		/>
	);
};

export default AgentLink;
