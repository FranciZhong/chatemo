import { NotificationType } from '@/lib/constants';
import { z } from 'zod';
import { RequestStatusEnumSchema, ValidStatusEnumSchema } from './common';
import { ModelConfigSchema } from './llm';

export const ProfilePayloadSchema = z.object({
	name: z.string().min(5).max(32),
	email: z.string().email(),
	image: z.string().url().optional(),
	description: z.string().max(1024).optional(),
});

export type ProfilePayload = z.infer<typeof ProfilePayloadSchema>;

export const UserSchema = z.object({
	id: z.string(),
	createdAt: z.date(),
	name: z.string().min(5).max(32).optional().nullable(),
	email: z.string().email().optional().nullable(),
	image: z.string().url().optional().nullable(),
	description: z.string().max(1024).optional().nullable(),
});

export type UserZType = z.infer<typeof UserSchema>;

export const ApiConfigSchema = z.object({
	openaiApiKey: z.string().optional(),
	anthropicApiKey: z.string().optional(),
	geminiApiKey: z.string().optional(),
});

export type ApiConfigZType = z.infer<typeof ApiConfigSchema>;

export const UserConfigSchema = z.object({
	apiConfig: ApiConfigSchema.optional(),
	modelConfig: ModelConfigSchema.optional(),
});

export type UserConfigZType = z.infer<typeof UserConfigSchema>;

export const FriendRequestSchema = z.object({
	id: z.string(),
	createdAt: z.date(),
	senderId: z.string(),
	receiverId: z.string(),
	status: RequestStatusEnumSchema,
});
export type FriendRequestZType = z.infer<typeof FriendRequestSchema>;

export const FriendshipSchema = z.object({
	id: z.string(),
	createdAt: z.date(),
	userId: z.string(),
	friendId: z.string(),
	conversationId: z.string(),
	valid: ValidStatusEnumSchema,
	friend: UserSchema.optional(),
});

export type FriendshipZType = z.infer<typeof FriendshipSchema>;

export const UserProfileSchema = UserSchema.extend({
	config: UserConfigSchema.optional(),
	friendships: z.array(FriendshipSchema).optional(),
});

export type UserProfileZType = z.infer<typeof UserProfileSchema>;

export const NotificationSchema = z.object({
	type: z.enum([
		NotificationType.FRIEND_REQUEST,
		NotificationType.JOIN_CHANNEL_REQUEST,
		NotificationType.INVITE_CHANNEL_REQUEST,
	]),
	referToId: z.string().optional(),
	referTo: z.any().optional(),
	from: UserSchema.optional(),
	title: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
});

export type NotificationZType = z.infer<typeof NotificationSchema>;
