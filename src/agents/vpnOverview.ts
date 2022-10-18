import { generateAgent } from '../utils/generateAgent.js';

export const vpnOverview = generateAgent('https://vpnoverview.com/privacy/anonymous-browsing/free-proxy-servers/', ({ $ }) => {
    return [...$('tbody > tr')].map((item) => {
        const elem = $(item);

        const host = elem.find('td:first-child').text().trim();
        const port = elem.find('td:nth-child(2)').text().trim();

        return {
            host,
            port,
            full: `${host}:${port}`,
            country: elem.find('td:nth-child(3)').text().toLowerCase(),
            protocol: elem.find('td:nth-child(5)').text().replace(/\s/g, '').trim().toLowerCase(),
            anonymity: elem.find('td:nth-child(6)').text().trim(),
        };
    });
});
