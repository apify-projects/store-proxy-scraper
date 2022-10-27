import { generateAgent } from '../utils/generateAgent.js';
import { proxyDataFromTable } from '../utils/proxyDataFromTable.js';

export const scrapingAnt = generateAgent('https://scrapingant.com/proxies', ({ $ }) => {
    return proxyDataFromTable(
        { $, rows: 'tr:not(:first-child)' },
        {
            host: 1,
            port: 2,
            protocol: 3,
            country: 4,
        }
    );

    // const rows = $('tr:not(:first-child)').toArray();

    // return rows.map((item) => {
    //     const elem = $(item);

    //     const host = elem.find('td:first-child').text().trim();
    //     const port = elem.find('td:nth-child(2)').text().trim();

    //     return {
    //         host,
    //         port,
    //         full: `${host}:${port}`,
    //         protocol: elem.find('td:nth-child(3)').text().trim().toLowerCase(),
    //         country: elem
    //             .find('td:nth-child(4)')
    //             .text()
    //             .replace(/[^\w\s]/g, '')
    //             .trim(),
    //         anonymity: null,
    //     };
    // });
});
