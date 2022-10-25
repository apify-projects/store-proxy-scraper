import type { RequestOptions } from 'crawlee';
import { v4 } from 'uuid';
import type { Proxy } from '../types/proxy.js';
import { generateAgent } from '../utils/generateAgent.js';

export const freeProxyCz = generateAgent(
    'http://free-proxy.cz/en/proxylist/main/1',
    async ({ crawler, $, request: { userData, label } }) => {
        const { lastPage } = userData as { lastPage?: number };

        if (!lastPage) {
            const last = +$('div.paginator a[href]:nth-last-child(2)').text();

            const requests: RequestOptions[] = [...Array(last + 1).keys()].slice(2).map((num) => ({
                url: `http://free-proxy.cz/en/proxylist/main/${num}`,
                label,
                uniqueKey: v4(),
                userData: {
                    lastPage: last,
                },
                headers: {
                    Referer: `http://free-proxy.cz/en/proxylist/main/${num - 1}`,
                },
            }));

            await crawler.addRequests(requests);
        }

        const rows = [...$('table#proxy_list tbody > tr')];

        return rows.reduce((acc, curr) => {
            const ipCell = $(curr).find('td > script');
            // Ignore empty cells
            if (!ipCell.length) return acc;

            const host = Buffer.from(ipCell.text().match(/(?<=Base64\.decode\(").*(?="\)\))/)![0]).toString('utf-8');
            const port = $(curr).find('td > span.fport').text().trim();

            acc.push({
                host,
                port,
                full: `${host}:${port}`,
                protocol: $(curr).find('td:nth-child(3) > small').text().trim().toLowerCase(),
                country: $(curr).find('td:nth-child(4) > div > a').text().trim(),
                anonymity: $(curr).find('td:nth-child(7) > small').text().trim().toLowerCase(),
            });
            return acc;
        }, [] as Proxy[]);
    }
);
