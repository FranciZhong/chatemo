import { AgentPromptZType, LlmMessageZType } from '@/types/llm';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AvatarSize } from './constants';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getAvatarSizeStyle = (size: AvatarSize) => {
	switch (size) {
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
	role: 'system',
	content: prompt.content,
});
