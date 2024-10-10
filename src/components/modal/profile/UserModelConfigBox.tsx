import { toast } from '@/components/ui/use-toast';
import axiosInstance from '@/lib/axios';
import { ApiUrl, ProfileModalTab, TOAST_ERROR_DEFAULT } from '@/lib/constants';
import useUserStore from '@/store/userStore';
import { FormatResponse } from '@/types/common';
import { ModelConfigZType } from '@/types/llm';
import { UserProfileZType } from '@/types/user';
import ModelConfigForm from '../form/ModelConfigForm';

const UserModelConfigBox: React.FC = () => {
	const { user, updateProfile } = useUserStore();

	const handleSubmit = async (values: ModelConfigZType) => {
		try {
			const response = await axiosInstance.post<
				FormatResponse<UserProfileZType>
			>(ApiUrl.UPDATE_MODEL_CONFIG, values);

			const userProfile = response.data.data!;

			updateProfile(userProfile);
		} catch (error) {
			toast(TOAST_ERROR_DEFAULT);
		}
	};

	return (
		<div className="flex flex-col gap-8">
			<h2 className="heading">
				{ProfileModalTab.MODEL_SETTING.toLocaleUpperCase()}
			</h2>
			<ModelConfigForm
				modelConfig={user?.config?.modelConfig}
				onSubmit={handleSubmit}
			/>
		</div>
	);
};

export default UserModelConfigBox;
