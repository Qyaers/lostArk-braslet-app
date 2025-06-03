import axios from 'axios';

const CLOUDFLARE_WORKER_URL = 'https://lost-ark-armory-parser-ru.remastedarchagenice.workers.dev';

const cache: Record<string, any> = {};

export const fetchData = async (endpoint: string) => {
    try {
        if (cache[endpoint]) {
            return cache[endpoint];
        }
        const response = await axios.get(
            `${CLOUDFLARE_WORKER_URL}?endpoint=${encodeURIComponent(endpoint)}`
        );

        cache[endpoint] = response.data;
        return response.data;
    } catch (error) {
        console.error('Ошибка:', error);
        return null;
    }
};