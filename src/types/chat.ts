import { ConversationType } from '@prisma/client';
import { z } from 'zod';
import { FriendshipSchema, UserSchema } from './user';

export const MessageSchema = z.object({
	id: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	senderId: z.string(),
	conversationId: z.string().nullable().optional(),
	content: z.string(),
	replyTo: z.string().nullable().optional(),
});

export type MessageZType = z.infer<typeof MessageSchema>;

export const MessageWithReplySchema = MessageSchema.extend({
	replyToMessage: MessageSchema,
});

export type MessageWithReplyZType = z.infer<typeof MessageWithReplySchema>;

export const ConversationTypeSchema = z.enum([ConversationType.DIRECT]);

export type ConversationTypeZType = z.infer<typeof ConversationTypeSchema>;

export const ParticipantSchema = z.object({
	id: z.string(),
	updatedAt: z.date(),
	userId: z.string(),
	user: UserSchema.optional(),
});

export const ConversationSchema = z.object({
	id: z.string(),
	type: ConversationTypeSchema,
	participants: z.array(ParticipantSchema),
	friendships: z.array(FriendshipSchema).optional(),
	messages: z.array(MessageWithReplySchema).optional(),
});

export type ConversationZType = z.infer<typeof ConversationSchema>;
