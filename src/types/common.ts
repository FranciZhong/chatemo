import { RequestStatus, ValidStatus } from '@prisma/client';
import { z } from 'zod';

export type FormatResponse<T> = {
	data?: T;
	message?: string;
	error?: string;
};

export const RequestStatusEnumSchema = z.enum([
	RequestStatus.PENDING,
	RequestStatus.ACCEPTED,
	RequestStatus.REJECTED,
]);

export type RequestStatusEnumZType = z.infer<typeof RequestStatusEnumSchema>;

export const ValidStatusEnumSchema = z.enum([
	ValidStatus.VALID,
	ValidStatus.INVALID,
]);

export type ValidStatusEnumZType = z.infer<typeof ValidStatusEnumSchema>;

export const AcceptRejectStatusSchema = z.enum([
	RequestStatus.ACCEPTED,
	RequestStatus.REJECTED,
]);

export type AcceptRejectStatusZType = z.infer<typeof RequestStatusEnumSchema>;

export const AcceptRejectPayloadSchema = z.object({
	referToId: z.string(),
	status: AcceptRejectStatusSchema,
});

export type AcceptRejectPayload = z.infer<typeof AcceptRejectPayloadSchema>;

export const IdPayloadSchema = z.object({
	referToId: z.string(),
});

export type IdPayload = z.infer<typeof IdPayloadSchema>;

export const ParentChildIdPayloadSchema = z.object({
	parentId: z.string(),
	childId: z.string(),
});

export type ParentChildIdPayload = z.infer<typeof ParentChildIdPayloadSchema>;
