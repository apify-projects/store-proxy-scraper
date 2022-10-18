import { Controller } from '../types/agent';
import { generateAgent } from '../utils/generateAgent.js';
import { VM } from 'vm2';

type NuxtData = {
    layout: string;
    data: [
        {
            protocols: string[];
            anons: string[];
            amount: number;
            data: {
                /**
                 * Country code
                 */
                code: string;
                count: number;
                /**
                 * All proxy IPs
                 */
                items: string[];
            }[];
        }
    ];
};

const controller: Controller = ({ $ }) => {
    const vm = new VM();
    const script = $('div#__nuxt + script').text();
    const nuxt = vm.run(script.replace(/window\.__NUXT__=/, '').trim()) as NuxtData;
    const {
        data: [proxyData],
    } = nuxt;

    // Proxies are grouped by their country. Map through all countries.
    return proxyData.data
        .map(({ code, items }) => {
            // For each country, map through all its proxy IPs.
            return items.map((full) => {
                const [host, port] = full.split(':');

                return {
                    host,
                    port,
                    full,
                    country: code,
                    protocol: proxyData.protocols.join(','),
                    anonymity: null,
                };
            });
        })
        .flat();
};

export const openProxyHttp = generateAgent('https://openproxy.space/list/http', controller);
export const openProxySocks4 = generateAgent('https://openproxy.space/list/socks4', controller);
export const openProxySocks5 = generateAgent('https://openproxy.space/list/socks5', controller);
