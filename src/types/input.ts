export type InputSchema = {
    proxy: {
        useApifyProxy?: boolean;
        apifyProxyGroups?: string[];
        proxyUrls?: string[];
    };
    runTests: boolean;
    debug: boolean;
    kvStoreName: string;
};
