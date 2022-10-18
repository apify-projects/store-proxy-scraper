import { RequestOptions } from 'crawlee';
import { v4 } from 'uuid';
import { generateAgent } from '../utils/generateAgent.js';

type UserData = {
    lastPage: number;
};

export const freeProxyWorld = generateAgent('https://www.freeproxy.world/?page=1', async ({ $, request: { label, userData }, crawler }) => {
    const { lastPage } = userData as UserData;

    if (!lastPage) {
        const last = Math.ceil(+$('blockquote').text().replace(/\D/g, '') / 50);

        const requests: RequestOptions[] = [...Array(last + 1).keys()].slice(2).map((page) => ({
            url: `https://www.freeproxy.world/?page=${page}`,
            label,
            uniqueKey: v4(),
            userData: {
                lastPage: last,
            },
        }));

        await crawler.addRequests(requests);
    }

    return [...$('tbody > tr:nth-child(even)')].map((item) => {
        const elem = $(item);

        const host = elem.find('td:first-child').text().trim();
        const port = elem.find('td:nth-child(2) > a').text().trim();

        return {
            host,
            port,
            full: `${host}:${port}`,
            country: elem.find('td:nth-child(3) a[href]').attr('href')!.split('=')[1]?.toLowerCase(),
            protocol: elem.find('td:nth-child(6)').text().trim().toLowerCase(),
            anonymity: elem.find('td:nth-child(7)').text().trim().toLowerCase(),
        };
    });
});
