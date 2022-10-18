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

export const theSpeedXHttp = generateAgent('https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt', controller);
export const theSpeedXSocks4 = generateAgent('https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/socks4.txt', controller);
export const theSpeedXSocks5 = generateAgent('https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/socks5.txt', controller);
