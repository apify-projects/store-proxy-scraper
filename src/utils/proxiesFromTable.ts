import type { Proxy } from '../types/proxy.js';
import type { load } from 'cheerio';
import type { Except } from 'type-fest';

type CheerioAPI = ReturnType<typeof load>;

type ProxyDataFromTableOptions = {
    $: CheerioAPI;
    rows: string;
};

type ProxyDataFromTableConfig = {
    [K in keyof Except<Proxy, 'full'>]?: number | string;
};

const proxyFields: (keyof Proxy)[] = ['host', 'port', 'full', 'anonymity', 'country', 'protocol'];

export const proxyDataFromTable = ({ $, rows }: ProxyDataFromTableOptions, config: ProxyDataFromTableConfig): Proxy[] => {
    const items = $(rows).toArray();

    return items.map((item) => {
        const elem = $(item);

        return proxyFields.reduce((acc, key) => {
            // populate full
            if (key === 'full') {
                return {
                    ...acc,
                    [key]: `${acc['host']}:${acc['port']}`,
                };
            }

            if (!config[key]) {
                return {
                    ...acc,
                    [key]: null,
                };
            }

            return {
                ...acc,
                [key]: $(elem)
                    .find(typeof config[key] === 'string' ? (config[key] as string) : `td:nth-child(${config[key]})`)
                    .text()
                    .trim()
                    .toLowerCase(),
            };
        }, {} as Proxy);
    });
};
