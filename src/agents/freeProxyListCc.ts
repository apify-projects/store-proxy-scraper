import { RequestOptions } from 'crawlee';
import { v4 } from 'uuid';
import { generateAgent } from '../utils/generateAgent.js';

type UserData = {
    lastPage: number;
};

export const freeProxyListCc = generateAgent(
    'https://freeproxylist.cc/servers/1.html',
    async ({ $, request: { label, userData }, crawler }) => {
        const { lastPage } = userData as UserData;

        if (!lastPage) {
            const last = +$('ul.pagination li:last-child > a[href]').attr('href')!.replace(/\D/g, '');

            const requests: RequestOptions[] = [...Array(last + 1).keys()].slice(2).map((page) => ({
                label,
                url: `https://freeproxylist.cc/servers/${page}.html`,
                uniqueKey: v4(),
                userData: {
                    lastPage: last,
                },
            }));

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
                country: elem.find('td:nth-child(3)').text().trim().toLowerCase(),
                anonymity: elem.find('td:nth-child(5)').text().trim().toLowerCase(),
                protocol: /no/gi.test(elem.find('td:nth-child(6)').text()) ? 'http' : 'https',
            };
        });
    }
);
