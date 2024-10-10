import { LlmProviderName, LlmRole } from '@/lib/constants';
import { LlmProviderError } from '@/server/error';
import { MessageZType } from '@/types/chat';
import {
	LlmMessageZType,
	LlmModelZType,
	LlmProvider,
	ModelParamsZType,
} from '@/types/llm';
import Anthropic, { AnthropicError } from '@anthropic-ai/sdk';
import {
	MessageParam,
	TextBlockParam,
} from '@anthropic-ai/sdk/resources/messages.mjs';

const models = [
	'claude-3-haiku-20240307',
	'claude-3-sonnet-20240229',
	'claude-3-opus-20240229',
	'claude-3-5-sonnet-20240620',
];

export default class AuthropicProvider implements LlmProvider {
	private client: Anthropic;

	constructor(apiKey: string) {
		this.client = new Anthropic({
			apiKey,
		});
	}

	private filterMessages(
		messages: LlmMessageZType[]
	): [TextBlockParam[], MessageParam[]] {
		const systemPrompts = messages
			.filter((item) => item.role === LlmRole.SYSTEM)
			.map(
				(item) =>
					({
						type: 'text',
						text: item.content,
					} as TextBlockParam)
			);

		const userPrompts = messages
			.filter((item) => item.role !== LlmRole.SYSTEM)
			.map((item) => item as MessageParam);

		return [systemPrompts, userPrompts];
	}

	public async getModels(): Promise<LlmModelZType[]> {
		return models.map(
			(item) =>
				({
					provider: LlmProviderName.ANTHROPIC,
					model: item,
				} as LlmModelZType)
		);
	}

	public async isAvailable(): Promise<boolean> {
		const message = await this.completeMessage(models[0], [
			{ role: LlmRole.USER, content: 'Hello' },
		]);

		return message && message.content.length > 0;
	}

	public prepareChatMessages(messages: MessageZType[]): LlmMessageZType[] {
		if (messages.length === 0) {
			return [];
		}
		const lastMessage = messages.at(0);
		const assistantMessages = messages
			.reverse()
			.filter((item) => item.type === 'MODEL');

		const id2MessageMap = messages.reduce((map, item) => {
			map.set(item.id, item);
			return map;
		}, new Map<string, MessageZType>());

		const parsedMessages: LlmMessageZType[] = [];

		for (const assistantMessage of assistantMessages) {
			if (
				assistantMessage.replyTo &&
				id2MessageMap.has(assistantMessage.replyTo)
			) {
				const replyToMessage = {
					role: LlmRole.USER,
					content: id2MessageMap.get(assistantMessage.replyTo)!.content,
				};

				const agentMessage = {
					role: LlmRole.ASSISTANT,
					content: assistantMessage.content,
				};

				parsedMessages.push(replyToMessage, agentMessage);
			}
		}

		if (lastMessage?.type === 'USER') {
			parsedMessages.push({
				role: LlmRole.USER,
				content: lastMessage.content,
			});
		}

		return parsedMessages;
	}

	public async completeMessage(
		model: string,
		messages: LlmMessageZType[],
		params?: ModelParamsZType
	): Promise<LlmMessageZType> {
		const [systemPrompts, userPrompts] = this.filterMessages(messages);

		try {
			const msg = await this.client.messages.create({
				model,
				messages: userPrompts,
				system: systemPrompts,
				max_tokens: params?.maxToken || 1000,
				temperature: params && params.temperature / 2,
				top_p: params?.topP,
			});

			const returnedMessage =
				msg.content[0].type === 'text' ? msg.content[0].text : '';

			return {
				role: LlmRole.ASSISTANT,
				content: returnedMessage,
			};
		} catch (error) {
			if (error instanceof AnthropicError) {
				throw new LlmProviderError(LlmProviderName.ANTHROPIC, error.message);
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
		const [systemPrompts, userPrompts] = this.filterMessages(messages);

		try {
			this.client.messages
				.stream({
					model,
					messages: userPrompts,
					system: systemPrompts,
					max_tokens: params?.maxToken || 1000,
					temperature: params && params.temperature / 2,
					top_p: params?.topP,
				})
				.on('text', (text) => {
					callback(text);
				});
		} catch (error) {
			if (error instanceof AnthropicError) {
				throw new LlmProviderError(LlmProviderName.ANTHROPIC, error.message);
			} else {
				throw error;
			}
		}
	}
}
