import { RequestOptions } from 'crawlee';
import { v4 } from 'uuid';
import atob from 'atob';

import { generateAgent } from '../utils/generateAgent.js';

type UserData = {
    lastPage: number;
    currentPage: number;
};

export const advancedName = generateAgent('https://advanced.name/freeproxy', async ({ crawler, $, request: { label, userData } }) => {
    const { lastPage } = userData as UserData;

    if (!lastPage) {
        const last = +$('ul.pagination > li:nth-last-child(2) > a').text().trim();

        const requests: RequestOptions[] = [...Array(last + 1).keys()].slice(2).map((page) => ({
            url: `https://advanced.name/freeproxy?page=${page}`,
            uniqueKey: v4(),
            label,
            userData: {
                lastPage: last,
                currentPage: page,
            },
        }));

        await crawler.addRequests(requests);
    }

    return [...$('tbody > tr')].map((item) => {
        const elem = $(item);

        const host = atob(elem.find('td[data-ip]').attr('data-ip')!);
        const port = atob(elem.find('td[data-port]').attr('data-port')!);

        return {
            host,
            port,
            full: `${host}:${port}`,
            country: elem.find('td:nth-child(5) > a').text().trim().toLowerCase(),
            protocol:
                [...elem.find('td:nth-child(4) > a:not(:last-child)')]
                    .map((a) => $(a).text().trim())
                    .join(',')
                    .toLowerCase() || null,
            anonymity:
                elem.find('td:nth-child(4) > a').length === 1
                    ? null
                    : elem.find('td:nth-child(4) > a:last-child').text().trim().toLowerCase(),
        };
    });
});
