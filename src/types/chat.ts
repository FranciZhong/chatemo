import { ConversationType } from '@prisma/client';
import { z } from 'zod';
import { UserSchema } from './user';

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

export const ConversationSchema = z.object({
	id: z.string(),
	type: ConversationTypeSchema,
	participants: z.array(UserSchema),
	messages: z.array(MessageWithReplySchema).optional(),
});

export type ConversationZType = z.infer<typeof ConversationSchema>;
