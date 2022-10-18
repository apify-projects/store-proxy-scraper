import { generateAgent } from '../utils/generateAgent.js';
import type { Controller } from '../types/agent.js';

const controller: Controller = ({ body, request }) => {
    const content = Buffer.from(body).toString('utf-8').trim();

    return content.split(/\n/).map((str) => {
        const [host, port] = str.split(':').map((str) => str.trim());

        return {
            host,
            port,
            full: `${host}:${port}`,
            protocol: new URL(request.url).searchParams.get('protocol'),
            country: null,
            anonymity: null,
        };
    });
};

export const proxyScrapeHttp = generateAgent(
    'https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=all',
    controller
);

export const proxyScrapeSocks4 = generateAgent(
    'https://api.proxyscrape.com/v2/?request=getproxies&protocol=socks4&timeout=10000&country=all',
    controller
);

export const proxyScrapeSocks5 = generateAgent(
    'https://api.proxyscrape.com/v2/?request=getproxies&protocol=socks5&timeout=10000&country=all',
    controller
);
