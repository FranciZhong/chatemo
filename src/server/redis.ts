import Redis from 'ioredis';

export const initClient = () => {
	const client = new Redis(
		process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
		process.env.REDIS_HOST || 'localhost',
		{
			password: process.env.REDIS_PASSWORD,
			db: process.env.REDIS_DB ? parseInt(process.env.REDIS_DB) : 0,
		}
	);

	client.on('connect', () => {
		console.log('Connected to Redis');
	});

	client.on('error', (err) => {
		console.error('Redis error: ', err);
	});

	return client;
};
