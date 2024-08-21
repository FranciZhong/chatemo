interface Props {
	children: React.ReactNode;
}

export default function ChatLayout({ children }: Props) {
	// use window size

	return <main className="w-screen h-screen">{children}</main>;
}
