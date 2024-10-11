import { AgentPromptZType, LlmMessageZType } from '@/types/llm';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AvatarSize, LlmRole } from './constants';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getAvatarSizeStyle = (size: AvatarSize) => {
	switch (size) {
		case AvatarSize.XL:
			return 'h-36 w-36';
		case AvatarSize.LG:
			return 'h-16 w-16';
		case AvatarSize.SM:
			return 'h-8 w-8';
		case AvatarSize.XS:
			return 'h-6 w-6';
		default:
			return 'h-10 w-10';
	}
};

export const convertPrompt2LlmMessage = (
	prompt: AgentPromptZType
): LlmMessageZType => ({
	role: LlmRole.SYSTEM,
	content: prompt.content,
});

export const parseIntVal = (val: any) => {
	if (typeof val === 'string') {
		const parsed = parseInt(val, 10);
		if (!isNaN(parsed)) {
			return parsed;
		}
	}
	return val;
};
