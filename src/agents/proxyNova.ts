import { VM } from 'vm2';
import atob from 'atob';
import btoa from 'btoa';
import { generateAgent } from '../utils/generateAgent.js';

export const proxyNova = generateAgent('https://www.proxynova.com/proxy-server-list/', ({ $ }) => {
    const vm = new VM();

    return [...$('tbody:nth-child(2) tr[data-proxy-id]')].map((item) => {
        const elem = $(item);

        const code = elem
            .find('td:first-child')
            .text()
            .match(/(?<=document\.write\().+(?=\))/)![0];

        const host = vm.run(`atob = ${atob}; btoa = ${btoa}; (() => ${code})();`) as string;
        const port = elem.find('td:nth-child(2)').text().trim();

        return {
            host,
            port,
            full: `${host}:${port}`,
            country: elem.find('td:nth-child(6) > a').attr('title')?.replace('Proxies from ', '')?.toLowerCase() || null,
            anonymity: elem.find('td:nth-child(7)').text().trim(),
            protocol: null,
        };
    });
});
