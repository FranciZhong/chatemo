'use client';

import IconButton from '@/components/IconButton';
import SelectModelButton from '@/components/SelectModelButton';
import TooltipLabel from '@/components/TooltipLabel';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { ModelConfigSchema, ModelConfigZType } from '@/types/llm';
import { zodResolver } from '@hookform/resolvers/zod';
import { Cross1Icon } from '@radix-ui/react-icons';
import { useForm } from 'react-hook-form';
import { Input } from '../../ui/input';
import { Slider } from '../../ui/slider';

interface Props {
	modelConfig?: ModelConfigZType;
	onSubmit: (data: ModelConfigZType) => Promise<void>;
}

const ModelConfigForm: React.FC<Props> = ({ modelConfig, onSubmit }) => {
	const form = useForm<ModelConfigZType>({
		resolver: zodResolver(ModelConfigSchema),
		defaultValues: {
			defaultModel: modelConfig?.defaultModel,
			modelParams: modelConfig?.modelParams || {
				maxHistory: 20,
				maxToken: 1000,
				temperature: 1.0,
				topP: 0.5,
				frequencyPenalty: 0.0,
				presencePenalty: 0.0,
			},
		},
	});

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="defaultModel"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								<TooltipLabel
									label="Default Model"
									tooltipContent="Choose the default model from the available options based on your API keys. This model will be used every time you log in to Chatemo."
								/>
							</FormLabel>
							<FormControl>
								<div className="w-96 flex justify-between items-center gap-4">
									<SelectModelButton
										selectedModel={field.value}
										onSelectedModelChange={field.onChange}
										variant="config"
									/>

									<IconButton
										onClick={() => {
											form.setValue('defaultModel', null);
										}}
									>
										<Cross1Icon />
									</IconButton>
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="modelParams.maxHistory"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								<TooltipLabel
									label="Maximum history messages"
									tooltipContent="This parameter defines how many previous messages are included as context when making LLM API calls."
								/>
							</FormLabel>
							<FormControl>
								<div className="flex justify-between gap-8">
									<Slider
										value={[field.value]}
										onValueChange={(arr) => field.onChange(arr[0])}
										min={5}
										max={50}
										step={1}
									/>
									<Input {...field} type="number" className="w-24" />
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="modelParams.maxToken"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								<TooltipLabel
									label="Maximum token"
									tooltipContent="Defines the maximum number of tokens (words, punctuation, etc.) that the model can generate in a single response."
								/>
							</FormLabel>
							<FormControl>
								<div className="flex justify-between gap-8">
									<Slider
										value={[field.value]}
										onValueChange={(arr) => field.onChange(arr[0])}
										min={50}
										max={10000}
										step={50}
									/>
									<Input {...field} type="number" className="w-24" />
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="modelParams.temperature"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								<TooltipLabel
									label="Temperature"
									tooltipContent="Controls the randomness of the model’s responses. A lower temperature (closer to 0) makes the model more deterministic, meaning it will choose the most likely response. A higher temperature (closer to 2) makes the model more creative and varied in its responses."
								/>
							</FormLabel>
							<FormControl>
								<div className="flex justify-between gap-8">
									<Slider
										value={[field.value]}
										onValueChange={(arr) => field.onChange(arr[0])}
										min={0.0}
										max={2.0}
										step={0.02}
									/>
									<Input {...field} type="ratio" className="w-24" />
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="modelParams.topP"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								<TooltipLabel
									label="Top P"
									tooltipContent="Controls the diversity of the model's responses by considering only the top percentage of probability mass when generating each token."
								/>
							</FormLabel>
							<FormControl>
								<div className="flex justify-between gap-8">
									<Slider
										value={[field.value]}
										onValueChange={(arr) => field.onChange(arr[0])}
										min={0.0}
										max={1.0}
										step={0.01}
									/>
									<Input {...field} type="ratio" className="w-24" />
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="modelParams.frequencyPenalty"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								<TooltipLabel
									label="Frequency Penalty"
									tooltipContent="Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim."
								/>
							</FormLabel>
							<FormControl>
								<div className="flex justify-between gap-8">
									<Slider
										value={[field.value]}
										onValueChange={(arr) => field.onChange(arr[0])}
										min={-2.0}
										max={2.0}
										step={0.04}
									/>
									<Input {...field} type="ratio" className="w-24" />
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="modelParams.presencePenalty"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								<TooltipLabel
									label="Presence Penalty"
									tooltipContent="Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics."
								/>
							</FormLabel>
							<FormControl>
								<div className="flex justify-between gap-8">
									<Slider
										value={[field.value]}
										onValueChange={(arr) => field.onChange(arr[0])}
										min={-2.0}
										max={2.0}
										step={0.04}
									/>
									<Input {...field} type="ratio" className="w-24" />
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="flex justify-end">
					<Button type="submit">Update</Button>
				</div>
			</form>
		</Form>
	);
};

export default ModelConfigForm;
