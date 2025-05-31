import axios from 'axios';

const CLOUDFLARE_WORKER_URL = 'https://lost-ark-armory-parser-ru.remastedarchagenice.workers.dev';

export const fetchData = async (endpoint:string) => {
    try {
        const response = await axios.get(`${CLOUDFLARE_WORKER_URL}?endpoint=${encodeURIComponent(endpoint)}`);
        return response.data;
    } catch (error) {
        console.error('Ошибка:', error);
        return null;
    }
};