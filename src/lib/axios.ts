import { PageUrl } from '@/app/constants';
import { toast } from '@/components/ui/use-toast';
import axios, { HttpStatusCode } from 'axios';
import Router from 'next/router';

const axiosInstance = axios.create({
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
});

axiosInstance.interceptors.response.use(
	(response) => {
		if (response.data.message) {
			toast({
				title: 'Success',
				description: response.data.message,
			});
		}

		return response;
	},
	(error) => {
		if (error.response?.status === HttpStatusCode.Unauthorized) {
			Router.push(PageUrl.LOGIN);
		}
		if (axios.isAxiosError(error)) {
			if (error.response) {
				toast({
					title: 'Error',
					description: error.response.data.error,
				});
				console.log('Error:', error.response.data.error);

				return error.response;
			} else if (error.request) {
				console.error('No response received:', error.request);
			} else {
				console.error('Error message:', error.message);
			}
		} else {
			console.error('Unexpected error:', error);
		}
		return Promise.reject(error);
	}
);

export default axiosInstance;
