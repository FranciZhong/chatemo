import { LlmProviderName, LlmRole } from '@/lib/constants';
import { z } from 'zod';
import { MessageZType } from './chat';

export interface LlmProvider {
	getModels: () => Promise<LlmModelZType[]>;

	isAvailable: () => Promise<boolean>;

	prepareChatMessages: (messages: MessageZType[]) => LlmMessageZType[];

	completeMessage: (
		model: string,
		messages: LlmMessageZType[],
		params?: ModelParamsZType
	) => Promise<LlmMessageZType>;

	streamMessage: (
		model: string,
		messages: LlmMessageZType[],
		callback: (chunk: string) => void,
		params?: ModelParamsZType
	) => Promise<void>;
}

export const LlmProviderNameSchema = z.enum([
	LlmProviderName.OPENAI,
	LlmProviderName.ANTHROPIC,
	LlmProviderName.GEMINI,
]);

export const LlmModelSchema = z.object({
	provider: LlmProviderNameSchema,
	model: z.string(),
});

export type LlmModelZType = z.infer<typeof LlmModelSchema>;

export const ModelParamsSchema = z.object({
	maxHistory: z.number().int().min(5).max(50).default(20),
	maxToken: z.number().int().min(50).max(10000).default(1000),
	temperature: z.number().min(0).max(2).default(1),
	topP: z.number().min(0).max(1).default(0.5),
	frequencyPenalty: z.number().min(-2).max(2).default(0),
	presencePenalty: z.number().min(-2).max(2).default(0),
});

export type ModelParamsZType = z.infer<typeof ModelParamsSchema>;

export const ModelConfigSchema = z.object({
	defaultModel: LlmModelSchema.nullable().optional(),
	modelParams: ModelParamsSchema.optional(),
});

export type ModelConfigZType = z.infer<typeof ModelConfigSchema>;

export const LlmMessageSchema = z.object({
	role: z.enum([LlmRole.SYSTEM, LlmRole.USER, LlmRole.ASSISTANT]),
	content: z.string().optional(),
	image: z.string().optional(),
});

export type LlmMessageZType = z.infer<typeof LlmMessageSchema>;

export const UidLlmMessageSchema = LlmMessageSchema.extend({
	uid: z.string(),
	model: LlmModelSchema.optional(),
});

export type UidLlmMessageZType = z.infer<typeof UidLlmMessageSchema>;

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
	config: ModelConfigSchema.optional(),
	prompts: z.array(AgentPromptSchema).optional(),
});

export type AgentZType = z.infer<typeof AgentSchema>;

export const AgentProfilePayloadSchema = z.object({
	name: z.string().min(5).max(32),
	description: z.string().max(1024),
	image: z.string(),
});

export type AgentProfilePayload = z.infer<typeof AgentProfilePayloadSchema>;

export const UpdateAgentProfilePayloadSchema = AgentProfilePayloadSchema.extend(
	{
		agentId: z.string(),
	}
);

export type UpdateAgentProfilePayload = z.infer<
	typeof UpdateAgentProfilePayloadSchema
>;

export const AgentConfigPayloadSchema = z.object({
	agentId: z.string(),
	config: ModelConfigSchema,
});

export type AgentConfigPayload = z.infer<typeof AgentConfigPayloadSchema>;

export const AgentReplyPayloadSchema = z.object({
	replyTo: z.string(),
	provider: LlmProviderNameSchema,
	model: z.string(),
	agentId: z.string().optional(),
});

export type AgentReplyPayload = z.infer<typeof AgentReplyPayloadSchema>;

export const AgentPreviewPayloadSchema = z.object({
	model: LlmModelSchema,
	referToId: z.string(),
	history: z.array(LlmMessageSchema),
	agentId: z.string().optional(),
});

export type AgentPreviewPayload = z.infer<typeof AgentPreviewPayloadSchema>;

export const StreamMessagePayloadSchema = z.object({
	referToId: z.string(),
	finished: z.boolean(),
	chunk: z.string().optional(),
});

export type StreamMessagePayload = z.infer<typeof StreamMessagePayloadSchema>;
