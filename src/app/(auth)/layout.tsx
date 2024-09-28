import RepeatedBackground from '@/components/RepeatedBackground';
import { ImgUrl } from '../../lib/constants';

interface Props {
	children: React.ReactNode;
}

const layout: React.FC<Props> = ({ children }) => {
	return (
		<div className="h-screen w-screen">
			<RepeatedBackground img={ImgUrl.BG_REPEAT}>
				<div className="h-full w-full z-0 flex justify-center items-center">
					{children}
				</div>
			</RepeatedBackground>
		</div>
	);
};

export default layout;
