import { LlmProviderName } from '@/lib/constants';
import { HttpStatusCode } from 'axios';

export class ApiError extends Error {
	statusCode: number;

	constructor(statusCode: number, message: string) {
		super(message);
		this.statusCode = statusCode;
	}
}

export class BadRequestError extends ApiError {
	constructor(message: string = 'Bad request.') {
		super(HttpStatusCode.BadRequest, message);
	}
}

export class UnauthorizedError extends ApiError {
	constructor(message: string = 'Unauthorized.') {
		super(HttpStatusCode.Unauthorized, message);
	}
}

export class ForbiddenError extends ApiError {
	constructor(message: string = 'Forbidden.') {
		super(HttpStatusCode.Forbidden, message);
	}
}

export class NotFoundError extends ApiError {
	constructor(message: string = 'Not found.') {
		super(HttpStatusCode.NotFound, message);
	}
}

export class MethodNotAllowedError extends ApiError {
	constructor(message: string = 'Method not allowed.') {
		super(HttpStatusCode.MethodNotAllowed, message);
	}
}

export class ConflictError extends ApiError {
	constructor(message: string = 'Conflict.') {
		super(HttpStatusCode.Conflict, message);
	}
}

export class LlmProviderError extends Error {
	provider: LlmProviderName;

	constructor(provider: LlmProviderName, message: string) {
		super(message);
		this.provider = provider;
	}
}
