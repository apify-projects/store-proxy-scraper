import { generateAgent } from '../utils/generateAgent.js';
import type { Controller } from '../types/agent.js';

const controller: Controller = ({ body, request }) => {
    const content = Buffer.from(body).toString('utf-8');

    return content.match(/^[\d.:]+.+$/gm)!.map((str) => {
        const [full, countryData] = str.split(/(?<=\d)\s(?=\w)/);
        const [host, port] = full.split(':');

        return {
            full,
            host,
            port,
            protocol: request.url.includes('socks') ? 'socks' : 'http/https',
            anonymity: null,
            country: countryData.match(/^\w{2}/)?.[0] || null,
        };
    });
};

export const spysMeHttp = generateAgent('https://spys.me/proxy.txt', controller);
export const spysMeSocks = generateAgent('https://spys.me/socks.txt', controller);
