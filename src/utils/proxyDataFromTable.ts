import type { Proxy } from '../types/proxy.js';
import type { load } from 'cheerio';
import type { Except } from 'type-fest';

type CheerioAPI = ReturnType<typeof load>;

type ProxyDataFromTableOptions = {
    /**
     * Cheerio object
     */
    $: CheerioAPI;
    /**
     * The selector for all the rows.
     */
    rows: string;
};

/**
 * Properties with either a number defining the position the data has in the row, or a selector to be used.
 */
type ProxyDataFromTableConfig = {
    [K in keyof Except<Proxy, 'full' | 'anonymity' | 'country'>]: number | string | null;
} & {
    [K in keyof Except<Proxy, 'full' | 'host' | 'port' | 'protocol'>]?: number | string | null;
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
