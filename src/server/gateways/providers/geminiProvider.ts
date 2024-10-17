import { LlmProviderName, LlmRole } from '@/lib/constants';
import { fetchImageAsBase64, getImageType } from '@/lib/utils';
import { LlmProviderError } from '@/server/error';
import { MessageZType } from '@/types/chat';
import {
	LlmMessageZType,
	LlmModelZType,
	LlmProvider,
	ModelParamsZType,
} from '@/types/llm';
import {
	Content,
	GoogleGenerativeAI,
	GoogleGenerativeAIError,
	HarmBlockThreshold,
	HarmCategory,
	InlineDataPart,
	Part,
	TextPart,
} from '@google/generative-ai';

const models = [
	'gemini-1.5-flash',
	'gemini-1.5-flash-8b',
	'gemini-1.5-pro',
	'gemini-1.0-pro',
	'text-embedding-004',
	'aqa',
];

const safetySettings = [
	{
		category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
		threshold: HarmBlockThreshold.BLOCK_NONE,
	},
	{
		category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
		threshold: HarmBlockThreshold.BLOCK_NONE,
	},
	{
		category: HarmCategory.HARM_CATEGORY_HARASSMENT,
		threshold: HarmBlockThreshold.BLOCK_NONE,
	},
	{
		category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
		threshold: HarmBlockThreshold.BLOCK_NONE,
	},
];

export default class GeminiProvider implements LlmProvider {
	private client: GoogleGenerativeAI;

	constructor(apiKey: string) {
		this.client = new GoogleGenerativeAI(apiKey);
	}

	public async getModels(): Promise<LlmModelZType[]> {
		return models.map(
			(item) =>
				({
					provider: LlmProviderName.GEMINI,
					model: item,
				} as LlmModelZType)
		);
	}

	public async isAvailable(): Promise<boolean> {
		const message = await this.completeMessage(models[0], [
			{ role: LlmRole.USER, content: 'Hello' },
		]);

		return message.content !== undefined && message.content.length > 0;
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
			const [systemInstruction, parsedMessages] = await this.filterMessages(
				messages
			);

			const llmModel = this.client.getGenerativeModel({
				model,
				systemInstruction,
			});

			const result = await llmModel.generateContent({
				contents: parsedMessages,
				safetySettings,
				generationConfig: {
					maxOutputTokens: params?.maxToken,
					temperature: params?.temperature,
					topP: params?.topP,
					// presencePenalty: params?.presencePenalty,
					// frequencyPenalty: params?.frequencyPenalty,
				},
			});

			const returnedContent = result.response.text();

			if (!returnedContent) {
				throw new LlmProviderError(
					LlmProviderName.GEMINI,
					`No returned message from request: ${{ model, messages }}`
				);
			}

			return {
				role: LlmRole.ASSISTANT,
				content: returnedContent,
			};
		} catch (error) {
			if (error instanceof GoogleGenerativeAIError) {
				throw new LlmProviderError(LlmProviderName.GEMINI, error?.message);
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
			const [systemInstruction, parsedMessages] = await this.filterMessages(
				messages
			);

			const llmModel = this.client.getGenerativeModel({
				model,
				systemInstruction,
			});

			const result = await llmModel.generateContentStream({
				contents: parsedMessages,
				safetySettings,
				generationConfig: {
					maxOutputTokens: params?.maxToken,
					temperature: params?.temperature,
					topP: params?.topP,
					// presencePenalty: params?.presencePenalty,
					// frequencyPenalty: params?.frequencyPenalty,
				},
			});

			for await (const chunk of result.stream) {
				callback(chunk.text());
			}
		} catch (error) {
			if (error instanceof GoogleGenerativeAIError) {
				throw new LlmProviderError(LlmProviderName.GEMINI, error?.message);
			} else {
				throw error;
			}
		}
	}

	private async filterMessages(
		messages: LlmMessageZType[]
	): Promise<[Content | undefined, Content[]]> {
		const systemMessages = messages.filter(
			(item) => item.role === LlmRole.SYSTEM
		);

		const systemInstruction =
			systemMessages.length > 0
				? ({
						role: 'system',
						parts: systemMessages.map(
							(item) =>
								({
									text: item.content,
								} as TextPart)
						),
				  } as Content)
				: undefined;

		const parsedMessages: Content[] = [];
		for (const item of messages) {
			if (item.role === LlmRole.SYSTEM) {
				continue;
			}

			const parts: Part[] = [];
			if (item.content) {
				parts.push({
					text: item.content,
				} as TextPart);
			}

			if (item.image) {
				const imageType = getImageType(item.image);
				if (imageType) {
					const imageBase64 = await fetchImageAsBase64(item.image);
					parts.push({
						inlineData: {
							mimeType: imageType,
							data: imageBase64,
						},
					} as InlineDataPart);
				}
			}

			if (parts.length !== 0) {
				parsedMessages.push({
					role: item.role === LlmRole.USER ? 'user' : 'model',
					parts,
				});
			}
		}

		return [systemInstruction, parsedMessages];
	}
}
