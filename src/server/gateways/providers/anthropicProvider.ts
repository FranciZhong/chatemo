import { LlmProviderName } from '@/lib/constants';
import { LlmProviderError } from '@/server/error';
import { LlmMessageZType, LlmModelZType, LlmProvider } from '@/types/llm';
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
			.filter((item) => item.role === 'system')
			.map(
				(item) =>
					({
						type: 'text',
						text: item.content,
					} as TextBlockParam)
			);

		const userPrompts = messages
			.filter((item) => item.role !== 'system')
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
			{ role: 'user', content: 'Hello' },
		]);

		return message && message.content.length > 0;
	}

	public async completeMessage(
		model: string,
		messages: LlmMessageZType[]
	): Promise<LlmMessageZType> {
		const [systemPrompts, userPrompts] = this.filterMessages(messages);

		try {
			const msg = await this.client.messages.create({
				max_tokens: 1024,
				model,
				messages: userPrompts,
				system: systemPrompts,
			});

			const returnedMessage =
				msg.content[0].type === 'text' ? msg.content[0].text : '';

			return {
				role: msg.role,
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
		callback: (chunk: string) => void
	): Promise<void> {
		const [systemPrompts, userPrompts] = this.filterMessages(messages);

		try {
			this.client.messages
				.stream({
					max_tokens: 1024,
					model,
					messages: userPrompts,
					system: systemPrompts,
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
