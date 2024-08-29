import { NotificationType } from '@/lib/constants';
import { z } from 'zod';
import { RequestStatusEnumSchema, ValidStatusEnumSchema } from './common';

export const UserSchema = z.object({
	id: z.string(),
	name: z.string().min(5).max(32).optional().nullable(),
	email: z.string().email().optional().nullable(),
	image: z.string().url().optional().nullable(),
	description: z.string().email().optional().nullable(),
	createdAt: z.date().optional().nullable(),
});

export type UserZType = z.infer<typeof UserSchema>;

export const UserConfigSchema = z.object({
	openaiApiKey: z.string().optional().nullable(),
});

export type UserConfigZType = z.infer<typeof UserConfigSchema>;

export const UserProfileSchema = UserSchema.extend({
	config: UserConfigSchema,
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
