import { LlmProviderName, NotificationType } from '@/lib/constants';
import { z } from 'zod';
import { RequestStatusEnumSchema, ValidStatusEnumSchema } from './common';

export const ProfilePayloadSchema = z.object({
	name: z.string().min(5).max(32),
	email: z.string().email(),
	image: z.string().url().optional(),
	description: z.string().max(1024).optional(),
});

export type ProfilePayload = z.infer<typeof ProfilePayloadSchema>;

export const UserSchema = z.object({
	id: z.string(),
	name: z.string().min(5).max(32).optional().nullable(),
	email: z.string().email().optional().nullable(),
	image: z.string().url().optional().nullable(),
	description: z.string().max(1024).optional().nullable(),
	createdAt: z.date().optional().nullable(),
});

export type UserZType = z.infer<typeof UserSchema>;

export const ApiConfigSchema = z.object({
	openaiApiKey: z.string().optional(),
	anthropicApiKey: z.string().optional(),
});

export type ApiConfigZType = z.infer<typeof ApiConfigSchema>;

export const ModelConfigSchema = z.object({
	defaultProvider: z
		.enum([LlmProviderName.OPENAI, LlmProviderName.ANTHROPIC])
		.optional(),
	defaultModel: z.string().optional(),
});

export type ModelConfigZType = z.infer<typeof ModelConfigSchema>;

export const UserConfigSchema = z.object({
	apiConfig: ApiConfigSchema.optional(),
	modelConfig: ModelConfigSchema.optional(),
});

export type UserConfigZType = z.infer<typeof UserConfigSchema>;

export const UserProfileSchema = UserSchema.extend({
	config: UserConfigSchema.optional(),
});

export type UserProfileZType = z.infer<typeof UserProfileSchema>;

export const FriendRequestPayloadSchema = z.object({
	receiverId: z.string(),
});

export type FriendRequestPayload = z.infer<typeof FriendRequestPayloadSchema>;

export const FriendRequestSchema = z.object({
	id: z.string(),
	senderId: z.string(),
	receiverId: z.string(),
	status: RequestStatusEnumSchema,
});
export type FriendRequestZType = z.infer<typeof FriendRequestSchema>;

export const FriendshipSchema = z.object({
	id: z.string(),
	userId: z.string(),
	friendId: z.string(),
	status: ValidStatusEnumSchema,
	friend: UserSchema.optional(),
});

export type FriendShipZType = z.infer<typeof FriendRequestSchema>;

export const NotificationSchema = z.object({
	type: z.enum([NotificationType.FRIEND_REQUEST]),
	referToId: z.string().optional(),
	referTo: z.any().optional(),
	from: UserSchema.optional(),
	title: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
});

export type NotificationZType = z.infer<typeof NotificationSchema>;
