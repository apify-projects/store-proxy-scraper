import { Actor } from 'apify';
import { CheerioCrawler, log, LogLevel } from '@crawlee/cheerio';
import { v4 } from 'uuid';

import { router } from './routes.js';
import type { InputSchema } from './types/input.js';
import { agents } from './agents/index.js';
import { Store } from './utils/ProxyStore.js';

await Actor.init();

const { proxy, runTests = true, debug = false, kvStoreName = 'default' } = (await Actor.getInput<InputSchema>()) ?? {};

await Store.init({ runTests, kvStoreName });

const proxyConfiguration = await Actor.createProxyConfiguration(proxy);

if (debug) log.setLevel(LogLevel.DEBUG);

const crawler = new CheerioCrawler({
    proxyConfiguration,
    requestHandler: router,
    // ? Good for when testing
    // maxRequestsPerCrawl: 50,
    autoscaledPoolOptions: {
        // Starting concurrency is 1. This lets the crawler
        // hit the ground running and start scaling from 6 instead.
        desiredConcurrency: 6,
    },
    sessionPoolOptions: {
        sessionOptions: {
            // Trash a proxy if it's even had just one error.
            maxErrorScore: 1,
            // Avoid rate limiting (especially with APIs).
            maxUsageCount: 2,
        },
    },
    // Sometimes they take this long to respond. ProxyScan takes a while.
    navigationTimeoutSecs: 120,
    // Prevent broken agents from retrying a bunch
    maxRequestRetries: 2,
    additionalMimeTypes: ['text/plain'],
});

// Scrape and collect all the proxies into ProxyStore
await crawler.run(
    // For each agent, queue a request
    agents.map(({ url, options }) => ({
        url,
        label: url,
        uniqueKey: v4(),
        ...options,
    }))
);

await Store.finish();
await Actor.exit();
