import { generateAgent } from '../utils/generateAgent.js';

export const proxyDaily = generateAgent('https://proxy-daily.com/', ({ $ }) => {
    return [...$('div.freeProxyStyle')]
        .map((item, i) => {
            const content = $(item).text().trim();
            const protocol = i === 0 ? 'http/https' : i === 1 ? 'socks4' : i === 2 ? 'socks5' : null;

            return content.split(/\n/).map((str) => {
                const [host, port] = str.split(':');

                return {
                    host,
                    port,
                    full: `${host}:${port}`,
                    protocol,
                    country: null,
                    anonymity: null,
                };
            });
        })
        .flat();
});
