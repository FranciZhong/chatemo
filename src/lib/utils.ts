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

export const fetchImageAsBase64 = async (url: string): Promise<string> => {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to fetch image: ${response.statusText}`);
	}
	const arrayBuffer = await response.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);
	return buffer.toString('base64');
};

export const getImageType = (url: string): string | null => {
	if (!url) {
		return null;
	}
	const fileType = url.split('.').at(-1);
	switch (fileType) {
		case 'jpg':
			return 'image/jpeg';
		case 'jpeg':
			return 'image/jpeg';
		case 'png':
			return 'image/png';
		case 'gif':
			return 'image/gif';
		case 'webp':
			return 'image/webp';
		default:
			return null;
	}
};
