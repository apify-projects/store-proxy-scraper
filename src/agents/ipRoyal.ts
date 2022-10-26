import { generateAgent } from '../utils/generateAgent.js';
import { proxyDataFromTable } from '../utils/proxyDataFromTable.js';

export const ipRoyal = generateAgent('https://iproyal.com/free-proxy-list/', ({ $ }) => {
    return proxyDataFromTable(
        { $, rows: 'table#proxy-table tbody > tr' },
        {
            host: 1,
            port: 2,
            protocol: 3,
            country: 4,
        }
    );
});
