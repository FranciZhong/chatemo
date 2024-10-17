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
	ChatCompletionContentPart,
	ChatCompletionContentPartImage,
	ChatCompletionContentPartText,
	ChatCompletionCreateParamsNonStreaming,
	ChatCompletionCreateParamsStreaming,
	ChatCompletionMessageParam,
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
		const parseMessages: LlmMessageZType[] = messages
			.slice(1)
			.reverse()
			.map(
				(item) =>
					({
						role: item.type === 'USER' ? LlmRole.USER : LlmRole.ASSISTANT,
						content: item.content,
					} as LlmMessageZType)
			);

		// only include the image in the last message
		const lastMessage = messages.at(0);
		if (lastMessage) {
			parseMessages.push({
				role: lastMessage.type === 'USER' ? LlmRole.USER : LlmRole.ASSISTANT,
				content: lastMessage.content,
				image: lastMessage.image || undefined,
			} as LlmMessageZType);
		}

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
				messages: this.parseMessages(messages),
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
				messages: this.parseMessages(messages),
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

	private parseMessages(
		messages: {
			role: LlmRole;
			content?: string | undefined;
			image?: string | undefined;
		}[]
	): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
		return messages.map((item) => {
			const content: Array<ChatCompletionContentPart> = [];
			if (item.content) {
				content.push({
					type: 'text',
					text: item.content,
				} as ChatCompletionContentPartText);
			}

			if (item.image) {
				content.push({
					type: 'image_url',
					image_url: {
						url: item.image,
					},
				} as ChatCompletionContentPartImage);
			}

			return {
				role: item.role,
				content,
			} as ChatCompletionMessageParam;
		});
	}
}
