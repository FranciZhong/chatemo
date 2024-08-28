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
