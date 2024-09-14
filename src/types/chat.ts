import { ConversationType } from '@prisma/client';
import { z } from 'zod';
import { AgentSchema, LlmProviderNameSchema } from './llm';
import { FriendshipSchema, UserSchema } from './user';

export const MessagePayloadSchema = z.object({
	content: z.string(),
	image: z.string().optional(),
	replyTo: z.string().optional(),
	provider: LlmProviderNameSchema.optional(),
	model: z.string().optional(),
	agentId: z.string().optional(),
});

export type MessagePayload = z.infer<typeof MessagePayloadSchema>;

export const ConversationMessagePayloadSchema = MessagePayloadSchema.extend({
	conversationId: z.string(),
});

export type ConversationMessagePayload = z.infer<
	typeof ConversationMessagePayloadSchema
>;

export const MessageTypeSchema = z.enum(['USER', 'MODEL']);
export type MessageTypeZType = z.infer<typeof MessageTypeSchema>;

export const BasicMessageSchema = z.object({
	id: z.string(),
	loading: z.boolean(),
	createdAt: z.date(),
	updatedAt: z.date(),
	type: MessageTypeSchema,
	senderId: z.string(),
	content: z.string(),
	image: z.string().nullable().optional(),
	replyTo: z.string().nullable().optional(),
	provider: LlmProviderNameSchema.nullable().optional(),
	model: z.string().nullable().optional(),
	agentId: z.string().nullable().optional(),
	agent: AgentSchema.nullable().optional(),
});

export type BasicMessageZType = z.infer<typeof BasicMessageSchema>;

export const MessageSchema = BasicMessageSchema.extend({
	replyToMessage: BasicMessageSchema.nullable().optional(),
});

export type MessageZType = z.infer<typeof MessageSchema>;

export const BasicConversationMessageSchema = BasicMessageSchema.extend({
	conversationId: z.string(),
});

export type BasicConversationMessageZType = z.infer<
	typeof BasicConversationMessageSchema
>;

export const ConversationMessageSchema = BasicConversationMessageSchema.extend({
	replyToMessage: BasicConversationMessageSchema.nullable().optional(),
});

export type ConversationMessageZType = z.infer<
	typeof ConversationMessageSchema
>;

export const ConversationTypeSchema = z.enum([ConversationType.DIRECT]);

export type ConversationTypeZType = z.infer<typeof ConversationTypeSchema>;

export const ParticipantSchema = z.object({
	id: z.string(),
	updatedAt: z.date(),
	userId: z.string(),
	user: UserSchema.optional(),
});

export type ParticipantZType = z.infer<typeof ParticipantSchema>;

export const ConversationSchema = z.object({
	id: z.string(),
	type: ConversationTypeSchema,
	participants: z.array(ParticipantSchema),
	friendships: z.array(FriendshipSchema).optional(),
	messages: z.array(ConversationMessageSchema).optional(),
});

export type ConversationZType = z.infer<typeof ConversationSchema>;
