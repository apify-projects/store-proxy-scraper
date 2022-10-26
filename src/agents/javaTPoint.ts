import { generateAgent } from '../utils/generateAgent.js';
import { proxyDataFromTable } from '../utils/proxyDataFromTable.js';

export const javaTPoint = generateAgent('https://www.javatpoint.com/proxy-server-list', ({ $ }) => {
    return proxyDataFromTable(
        { $, rows: 'table:nth-of-type(3) tr:not(:first-child)' },
        {
            host: 1,
            port: 2,
            protocol: 3,
            anonymity: 6,
            country: 7,
        }
    );
});
