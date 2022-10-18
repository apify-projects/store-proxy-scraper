import { generateAgent } from '../utils/generateAgent.js';
import type { Controller } from '../types/agent.js';

const controller: Controller = ({ body, request: { url } }) => {
    const content = Buffer.from(body).toString('utf-8').trim();
    const split = content.split(/\n/);

    return split.map((full) => {
        const [host, port] = full.split(':');

        return {
            host,
            port,
            full,
            protocol: new URL(url).searchParams.get('type')!,
            country: null,
            anonymity: null,
        };
    });
};

export const proxyScanHttp = generateAgent('https://proxyscan.io/download?type=http', controller);
export const proxyScanHttps = generateAgent('https://proxyscan.io/download?type=https', controller);
export const proxyScanSocks4 = generateAgent('https://proxyscan.io/download?type=socks4', controller);
export const proxyScanSocks5 = generateAgent('https://proxyscan.io/download?type=socks5', controller);
