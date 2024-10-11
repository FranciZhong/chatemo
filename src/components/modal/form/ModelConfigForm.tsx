'use client';

import IconButton from '@/components/IconButton';
import SelectModelButton from '@/components/SelectModelButton';
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
							<FormLabel>Default Model</FormLabel>
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
							<FormLabel>Maximum channel history</FormLabel>
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
							<FormLabel>Maximum token</FormLabel>
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
							<FormLabel>Temperature</FormLabel>
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
							<FormLabel>Top P</FormLabel>
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
							<FormLabel>Frequency Penalty</FormLabel>
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
							<FormLabel>Presence Penalty</FormLabel>
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
