import { generateAgent } from '../utils/generateAgent.js';
import { proxyDataFromTable } from '../utils/proxiesFromTable.js';

export const ipRoyal = generateAgent('https://iproyal.com/free-proxy-list/', ({ $ }) => {
    // const rows = $('table#proxy-table tbody > tr').toArray();

    return proxyDataFromTable(
        { $, rows: 'table#proxy-table tbody > tr' },
        {
            host: 1,
            port: 2,
            protocol: 3,
            country: 4,
        }
    );

    // return rows.map((item) => {
    //     const elem = $(item);

    //     const host = elem.find('td:first-child').text().trim();
    //     const port = elem.find('td:nth-child(2)').text().trim();

    //     return {
    //         host,
    //         port,
    //         full: `${host}:${port}`,
    //         protocol: elem.find('td:nth-child(3)').text().trim(),
    //         country: elem.find('td:nth-child(4)').text().trim(),
    //         anonymity: null,
    //     };
    // });
});
