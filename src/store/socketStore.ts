import { ApiUrl } from '@/lib/constants';
import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';

interface SocketStore {
	socket: Socket | null;
	connect: (url: string) => void;
	disconnect: () => void;
}

const defaultState = {
	socket: null,
};

const useSocketStore = create<SocketStore>((set) => ({
	...defaultState,
	connect: (url: string) => {
		const socket = io(url, {
			path: ApiUrl.SOCKET,
		});

		socket.on('connect', () => {
			console.log('Connected to socket server');
		});

		socket.on('connect_error', (error) => {
			console.error('Connection error:', error);
		});

		set((state) => ({
			...state,
			socket,
		}));
	},
	disconnect: () => {
		set((state) => {
			if (state.socket) {
				state.socket.disconnect();
			}
			return {
				...state,
				socket: null,
			};
		});
	},
}));

export default useSocketStore;
