'use client';

interface Props {
	img: string;
	children?: React.ReactNode;
}

const RepeatedBackground: React.FC<Props> = ({ img, children }) => {
	return (
		<div className="relative w-full h-full overflow-hidden">
			<div
				className="absolute inset-0 -z-10 bg-repeat animate-moveBackground"
				style={{
					backgroundImage: `url(${img})`,
				}}
			/>
			{children}
			<style jsx>{`
				@keyframes moveBackground {
					0% {
						background-position: 0 0;
					}
					100% {
						background-position: -100% 50%;
					}
				}
				.animate-moveBackground {
					animation: moveBackground 30s linear infinite;
				}
			`}</style>
		</div>
	);
};

export default RepeatedBackground;
