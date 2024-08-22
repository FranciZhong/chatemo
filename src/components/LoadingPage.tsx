import { ImgUrl } from '@/app/constants';
import Loading from './Loading';
import RepeatedBackground from './RepeatedBackground';

const LoadingPage: React.FC = () => {
	return (
		<div className="h-screen w-screen">
			<RepeatedBackground img={ImgUrl.BG_REPEAT}>
				<Loading />
			</RepeatedBackground>
		</div>
	);
};

export default LoadingPage;
