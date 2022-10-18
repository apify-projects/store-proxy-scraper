import { generateAgent } from '../utils/generateAgent.js';
import type { Controller } from '../types/agent.js';

const controller: Controller = ({ request, body }) => {
    const content = Buffer.from(body).toString('utf-8').trim();

    return content.split(/\n/).map((str) => {
        const [host, port] = str.split(':').map((str) => str.trim());

        return {
            host,
            port,
            full: `${host}:${port}`,
            protocol: new URL(request.url).searchParams.get('type'),
            anonymity: null,
            country: null,
        };
    });
};

export const proxyListDownloadHttp = generateAgent('https://www.proxy-list.download/api/v1/get?type=http', controller);
export const proxyListDownloadHttps = generateAgent('https://www.proxy-list.download/api/v1/get?type=https', controller);
export const proxyListDownloadSocks4 = generateAgent('https://www.proxy-list.download/api/v1/get?type=socks4', controller);
export const proxyListDownloadSocks5 = generateAgent('https://www.proxy-list.download/api/v1/get?type=socks5', controller);
