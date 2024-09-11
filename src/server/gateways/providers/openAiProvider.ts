import { LlmProviderName } from '@/lib/constants';
import { LlmProviderError } from '@/server/error';
import { LlmMessageZType, LlmModelZType, LlmProvider } from '@/types/llm';
import OpenAI, { OpenAIError } from 'openai';

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

	public async completeMessage(
		model: string,
		messages: LlmMessageZType[]
	): Promise<LlmMessageZType> {
		try {
			const completion = await this.client.chat.completions.create({
				model,
				messages,
			});

			const returnedMessage = completion.choices[0].message;

			return {
				role: returnedMessage.role,
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
		callback: (chunk: string) => void
	): Promise<void> {
		try {
			const stream = await this.client.chat.completions.create({
				stream: true,
				model,
				messages,
			});

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
