import { LlmProviderName } from '@/lib/constants';
import { z } from 'zod';
import { MessageZType } from './chat';

export interface LlmProvider {
	getModels: () => Promise<LlmModelZType[]>;

	isAvailable: () => Promise<boolean>;

	prepareChatMessages: (messages: MessageZType[]) => LlmMessageZType[];

	completeMessage: (
		model: string,
		messages: LlmMessageZType[]
	) => Promise<LlmMessageZType>;

	streamMessage: (
		model: string,
		messages: LlmMessageZType[],
		callback: (chunk: string) => void
	) => Promise<void>;
}

export const LlmProviderNameSchema = z.enum([
	LlmProviderName.OPENAI,
	LlmProviderName.ANTHROPIC,
]);

export const LlmModelSchema = z.object({
	provider: LlmProviderNameSchema,
	model: z.string(),
});

export type LlmModelZType = z.infer<typeof LlmModelSchema>;

export const LlmMessageSchema = z.object({
	role: z.enum(['system', 'user', 'assistant']),
	content: z.string(),
});

export type LlmMessageZType = z.infer<typeof LlmMessageSchema>;

export const AgentPromptPayloadSchema = z.object({
	agentId: z.string(),
	content: z.string(),
});

export type AgentPromptPayload = z.infer<typeof AgentPromptPayloadSchema>;

export const AgentPromptSchema = z.object({
	id: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	agentId: z.string(),
	content: z.string(),
});

export type AgentPromptZType = z.infer<typeof AgentPromptSchema>;

export const AgentSchema = z.object({
	id: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	userId: z.string(),
	name: z.string(),
	description: z.string().nullable().optional(),
	image: z.string().nullable().optional(),
	prompts: z.array(AgentPromptSchema).optional(),
});

export type AgentZType = z.infer<typeof AgentSchema>;

export const AgentProfilePayloadSchema = z.object({
	name: z.string().min(5).max(32),
	description: z.string().max(1024).optional(),
	image: z.string().optional(),
});

export type AgentProfilePayload = z.infer<typeof AgentProfilePayloadSchema>;

export const AgentReplyPayloadSchema = z.object({
	replyTo: z.string(),
	provider: LlmProviderNameSchema,
	model: z.string(),
	agentId: z.string().optional(),
});

export type AgentReplyPayload = z.infer<typeof AgentReplyPayloadSchema>;

export const AgentPreviewPayloadSchema = LlmModelSchema.extend({
	referToId: z.string(),
	request: z.string(),
	agentId: z.string().optional(),
});

export type AgentPreviewPayload = z.infer<typeof AgentPreviewPayloadSchema>;

export const StreamMessagePayloadSchema = z.object({
	referToId: z.string(),
	finished: z.boolean(),
	chunk: z.string().optional(),
});

export type StreamMessagePayload = z.infer<typeof StreamMessagePayloadSchema>;
