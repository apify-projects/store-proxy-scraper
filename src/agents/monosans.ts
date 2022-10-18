import { generateAgent } from '../utils/generateAgent.js';
import type { Controller } from '../types/agent.js';

const controller: Controller = ({ request: { url }, body }) => {
    const content = Buffer.from(body).toString('utf-8').trim();
    const split = content.split(/\n/);
    const protocol = url.split('/').pop()!.replace('.txt', '');

    return split.map((full) => {
        const [host, port] = full.split(':');

        return {
            full,
            host,
            port,
            protocol,
            anonymity: null,
            country: null,
        };
    });
};

export const monosansHttp = generateAgent('https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/http.txt', controller);
export const monosansSocks4 = generateAgent('https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/socks4.txt', controller);
export const monosansSocks5 = generateAgent('https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/socks5.txt', controller);
