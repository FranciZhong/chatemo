import { LlmProviderName, LlmRole } from '@/lib/constants';
import { LlmProviderError } from '@/server/error';
import { MessageZType } from '@/types/chat';
import {
	LlmMessageZType,
	LlmModelZType,
	LlmProvider,
	ModelParamsZType,
} from '@/types/llm';
import OpenAI, { OpenAIError } from 'openai';
import {
	ChatCompletionCreateParamsNonStreaming,
	ChatCompletionCreateParamsStreaming,
} from 'openai/resources/index.mjs';

export default class OpenAiProvider implements LlmProvider {
	private client: OpenAI;

	constructor(apiKey: string) {
		this.client = new OpenAI({
			apiKey,
		});
	}

	public async getModels(): Promise<LlmModelZType[]> {
		return (await this.client.models.list()).data.map(
			(item) =>
				({
					provider: LlmProviderName.OPENAI,
					model: item.id,
				} as LlmModelZType)
		);
	}

	public async isAvailable(): Promise<boolean> {
		return (await this.getModels()).length !== 0;
	}

	public prepareChatMessages(messages: MessageZType[]): LlmMessageZType[] {
		const parseMessages: LlmMessageZType[] = messages.reverse().map(
			(item) =>
				({
					role: item.type === 'USER' ? LlmRole.USER : LlmRole.ASSISTANT,
					content: item.content,
				} as LlmMessageZType)
		);

		return parseMessages;
	}

	public async completeMessage(
		model: string,
		messages: LlmMessageZType[],
		params?: ModelParamsZType
	): Promise<LlmMessageZType> {
		try {
			let input: ChatCompletionCreateParamsNonStreaming = {
				model,
				messages,
			};
			if (params) {
				input = {
					...input,
					max_tokens: params.maxToken,
					temperature: params.temperature,
					top_p: params.topP,
					frequency_penalty: params.frequencyPenalty,
					presence_penalty: params.presencePenalty,
				};
			}

			const completion = await this.client.chat.completions.create(input);

			const returnedMessage = completion.choices[0].message;

			return {
				role: LlmRole.ASSISTANT,
				content: returnedMessage.content || returnedMessage.refusal || '',
			};
		} catch (error) {
			if (error instanceof OpenAIError) {
				throw new LlmProviderError(LlmProviderName.OPENAI, error?.message);
			} else {
				throw error;
			}
		}
	}

	public async streamMessage(
		model: string,
		messages: LlmMessageZType[],
		callback: (chunk: string) => void,
		params?: ModelParamsZType
	): Promise<void> {
		try {
			let input: ChatCompletionCreateParamsStreaming = {
				stream: true,
				model,
				messages,
			};
			if (params) {
				input = {
					...input,
					max_tokens: params.maxToken,
					temperature: params.temperature,
					top_p: params.topP,
					frequency_penalty: params.frequencyPenalty,
					presence_penalty: params.presencePenalty,
				};
			}

			const stream = await this.client.chat.completions.create(input);

			for await (const chunk of stream) {
				callback(chunk.choices[0]?.delta?.content || '');
			}
		} catch (error) {
			if (error instanceof OpenAIError) {
				throw new LlmProviderError(LlmProviderName.OPENAI, error?.message);
			} else {
				throw error;
			}
		}
	}
}
