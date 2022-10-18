import { v4 } from 'uuid';
import { generateAgent } from '../utils/generateAgent.js';

type GeoNodeProxy = {
    ip: string;
    country: string;
    port: string;
    protocols: string[];
    anonymityLevel: string;
};

type GeoNodeResponse = {
    data: GeoNodeProxy[];
    total: number;
    page: number;
    limit: number;
};

type UserData = {
    lastPage: number;
};

const createUrl = (page: number) => `https://proxylist.geonode.com/api/proxy-list?limit=500&page=${page}`;

export const geoNode = generateAgent(createUrl(1), async ({ json, request: { label, userData }, crawler }) => {
    const { lastPage } = userData as UserData;
    const { data, total, limit } = json as GeoNodeResponse;

    if (!lastPage) {
        const last = Math.ceil(total / limit);

        const requests = [...Array(last + 1).keys()].slice(2).map((page) => ({
            url: createUrl(page),
            label,
            uniqueKey: v4(),
            userData: {
                lastPage: last,
            },
        }));

        await crawler.addRequests(requests);
    }

    return data.map(({ ip, port, country, protocols, anonymityLevel }) => ({
        host: ip,
        port,
        country,
        protocol: protocols.join(', '),
        anonymity: anonymityLevel,
        full: `${ip}:${port}`,
    }));
});
