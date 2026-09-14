import { handle } from '@/mock-server/handlers';
import axios, { AxiosError } from 'axios';

export const apiClient = axios.create({
	baseURL: '/api',
	headers: { 'Content-Type': 'application/json' },
	// The backend is mocked in-process for local development. Requests never hit the network,
	// so they won't show in the devtools Network tab — the interceptors below log them instead.
	adapter: async config => {
		const { status, data } = await handle(config);
		const response = { data, status, statusText: '', headers: {}, config };
		if (status >= 400) {
			throw new AxiosError(`Request failed with status code ${status}`, String(status), config, undefined, response);
		}
		return response;
	},
});

apiClient.interceptors.response.use(
	response => {
		console.info(
			`[api] ${response.config.method?.toUpperCase()} ${response.config.url} → ${response.status}`,
			response.config.data ? { body: JSON.parse(String(response.config.data)) } : '',
		);
		return response;
	},
	(error: AxiosError) => {
		console.warn(
			`[api] ${error.config?.method?.toUpperCase()} ${error.config?.url} → ${error.response?.status}`,
			error.config?.data ? { body: JSON.parse(String(error.config.data)) } : '',
			error.response?.data,
		);
		return Promise.reject(error);
	},
);
