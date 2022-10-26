import { generateAgent } from '../utils/generateAgent.js';

export const vpnSide = generateAgent('https://www.vpnside.com/proxy/list/', ({ $ }) => {
    const rows = $('tbody > tr').toArray();

    return rows.map((item) => {
        const elem = $(item);

        const host = elem.find('td:first-child').text().trim();
        const port = elem.find('td:nth-child(2)').text().trim();

        return {
            host,
            port,
            full: `${host}:${port}`,
            country: elem.find('td:nth-child(3)').text().trim(),
            protocol: elem.find('td:nth-child(4)').text().toLowerCase().trim(),
            anonymity: null,
        };
    });
});
