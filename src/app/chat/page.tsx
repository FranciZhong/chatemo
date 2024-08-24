'use client';

import NavTopbar from '@/components/layout/NavTopbar';
import { Separator } from '@/components/ui/separator';

const page = () => {
	return (
		<div className="h-full w-full flex flex-col">
			<NavTopbar />
			<Separator orientation="horizontal" />
			<div className="flex-1 flex items-center justify-center">
				<h1>Welcome to CHATEMO</h1>
			</div>
		</div>
	);
};

export default page;
