import { generateAgent } from '../utils/generateAgent.js';
import type { Controller } from '../types/agent.js';

const controller: Controller = ({ $, request }) => {
    return [...$('#list tbody tr')].map((item) => {
        const elem = $(item);

        const host = elem.find('td:first-child').text().trim();
        const port = elem.find('td:nth-child(2)').text().trim();

        return {
            host,
            port,
            full: `${host}:${port}`,
            protocol: request.url.includes('https://www.socks-proxy.net/')
                ? elem.find('td:nth-child(5)').text().toLowerCase()
                : elem.find('td:nth-child(7)').text().includes('no')
                ? 'http'
                : 'https',
            country: elem.find('td:nth-child(3)').text().trim(),
            anonymity: request.url.includes('https://www.socks-proxy.net/')
                ? elem.find('td:nth-child(6)').text().trim()
                : elem.find('td:nth-child(5)').text().trim(),
        };
    });
};

export const socksProxy = generateAgent('https://www.socks-proxy.net/', controller);
export const usProxy = generateAgent('https://www.us-proxy.org/', controller);
export const ukProxy = generateAgent('https://free-proxy-list.net/uk-proxy.html', controller);
export const newProxy = generateAgent('https://free-proxy-list.net/', controller);
export const anonymousProxy = generateAgent('https://free-proxy-list.net/anonymous-proxy.html', controller);
export const sslProxies = generateAgent('https://www.sslproxies.org/', controller);
