import { generateAgent } from '../utils/generateAgent.js';

type HidesterProxy = {
    IP: string;
    PORT: string;
    country: string;
    type: string;
    anonymity: string;
};

export const hidester = generateAgent(
    'https://hidester.com/proxydata/php/data.php?mykey=data&offset=0&limit=999999999&orderBy=latest_check&sortOrder=DESC',
    ({ body }) => {
        const proxies = JSON.parse(Buffer.from(body).toString('utf-8')) as HidesterProxy[];

        return proxies.map(({ IP, PORT, country, type, anonymity }) => ({
            host: IP,
            port: PORT,
            full: `${IP}:${PORT}`,
            country: country.toLowerCase(),
            protocol: type.toLowerCase(),
            anonymity: anonymity.toLowerCase(),
        }));
    },
    {
        headers: {
            referer: 'https://hidester.com/proxylist/',
        },
    }
);
