import { generateAgent } from '../utils/generateAgent.js';

export const anonymouse = generateAgent('https://anonymouse.cz/proxy-list/', ({ $ }) => {
    return [...$('tbody > tr:not(:first-child)')].map((item) => {
        const elem = $(item);

        const host = elem.find('td:first-child').text().trim();
        const port = elem.find('td:nth-child(2)').text().trim();

        return {
            host,
            port,
            full: `${host}:${port}`,
            protocol: null,
            anonymity: null,
            country: elem.find('td:nth-child(3)').text().trim().toLowerCase(),
        };
    });
});
