import { generateAgent } from '../utils/generateAgent.js';

export const javaTPoint = generateAgent('https://www.javatpoint.com/proxy-server-list', ({ $ }) => {
    return [...$('table:nth-of-type(3) tr:not(:first-child)')].map((item) => {
        const elem = $(item);

        const host = elem.find('td:first-child').text().trim();
        const port = elem.find('td:nth-child(2)').text().trim();

        return {
            host,
            port,
            full: `${host}:${port}`,
            protocol: elem.find('td:nth-child(3)').text().trim().toLowerCase(),
            anonymity: elem.find('td:nth-child(6)').text().trim().toLowerCase(),
            country: elem.find('td:nth-child(7)').text().trim().toLowerCase(),
        };
    });
});
