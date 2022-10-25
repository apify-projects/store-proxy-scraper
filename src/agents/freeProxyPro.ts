import { RequestOptions } from 'crawlee';
import { v4 } from 'uuid';
import { generateAgent } from '../utils/generateAgent.js';

export const freeProxyPro = generateAgent('https://freeproxy.pro/', async ({ crawler, $, request: { userData, label } }) => {
    const { lastPage, currentPage } = userData as { lastPage: number; currentPage: number };

    if (!lastPage) {
        const max = +$('table + div + div.d-flex').text().split('of')![1].trim();
        const last = Math.ceil(max / 20);

        const requests: RequestOptions[] = [...Array(last + 1).keys()].slice(2).map((num) => {
            return {
                url: 'https://freeproxy.pro/',
                label,
                uniqueKey: v4(),
                userData: {
                    lastPage: last,
                    currentPage: num,
                },
                method: 'POST',
                payload: new URLSearchParams({
                    update_sorting: 'desc',
                    page: num.toString(),
                }).toString(),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            };
        });

        await crawler.addRequests(requests);
    }

    return [...$('tbody > tr')].map((item) => {
        const elem = $(item);
        const host = elem.find('td:first-child').text().trim();
        const port = elem.find('td:nth-child(2)').text().trim();

        return {
            host,
            port,
            full: `${host}:${port}`,
            country: elem.find('td:nth-child(3)').text().trim(),
            protocol: elem.find('td:nth-child(9)').text().trim(),
            anonymity: null,
        };
    });
});
