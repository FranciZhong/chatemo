import { LlmMessageZType, LlmProvider } from '@/types/llm';
import OpenAI from 'openai';

export default class OpenAiProvider implements LlmProvider {
	private client: OpenAI;

	constructor(apiKey: string) {
		this.client = new OpenAI({
			apiKey,
		});
	}

	public async getModels(): Promise<string[]> {
		return (await this.client.models.list()).data.map((item) => item.id);
	}

	public async isAvailable(): Promise<boolean> {
		return (await this.getModels()).length !== 0;
	}

	public async completeMessage(
		model: string,
		messages: LlmMessageZType[]
	): Promise<LlmMessageZType> {
		const completion = await this.client.chat.completions.create({
			model,
			messages,
		});

		const returnedMessage = completion.choices[0].message;

		return {
			role: returnedMessage.role,
			content: returnedMessage.content || returnedMessage.refusal || '',
		};
	}

	public async streamMessage(
		model: string,
		messages: LlmMessageZType[],
		callback: (chunk: string) => void
	): Promise<void> {
		const stream = await this.client.chat.completions.create({
			stream: true,
			model,
			messages,
		});

		for await (const chunk of stream) {
			callback(chunk.choices[0]?.delta?.content || '');
		}
	}
}
