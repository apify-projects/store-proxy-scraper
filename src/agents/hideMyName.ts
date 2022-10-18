import { RequestOptions } from 'crawlee';
import { v4 } from 'uuid';
import { generateAgent } from '../utils/generateAgent.js';

type UserData = {
    lastPage: number;
    currentPage: number;
};

export const hideMyName = generateAgent('https://hidemy.name/en/proxy-list/', async ({ crawler, $, request: { userData, label } }) => {
    const { lastPage } = userData as UserData;

    // If these values aren't yet in the userData, that means we haven't queued all the paginated requests
    if (!lastPage) {
        const last = +$('div.pagination ul li:nth-last-child(2) > a').text();

        // Create a range based on the last page
        const requests: RequestOptions[] = [...Array(last).keys()].slice(1).map((page) => ({
            label,
            // The "start" parameter is always a multiple of 64
            url: `https://hidemy.name/en/proxy-list/?start=${page * 64}`,
            uniqueKey: v4(),
            userData: {
                lastPage: last,
            },
        }));

        await crawler.addRequests(requests);
    }

    return [...$('div.services tbody tr')].map((item) => {
        const elem = $(item);

        const host = elem.find('td:first-child').text().trim();
        const port = elem.find('td:nth-child(2)').text().trim();

        return {
            host,
            port,
            full: `${host}:${port}`,
            country: elem.find('td:nth-child(3) > span.country').text().trim(),
            protocol: elem.find('td:nth-child(5)').text().toLowerCase(),
            anonymity: elem.find('td:nth-child(6)').text().toLowerCase(),
        };
    });
});
