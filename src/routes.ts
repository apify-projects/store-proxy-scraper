import { createCheerioRouter, log } from 'crawlee';
import { Store } from './utils/ProxyStore.js';

import { agents } from './agents/index.js';

export const router = createCheerioRouter();

router.addDefaultHandler(({ request }) => log.warning(`Unknown route reached: ${request.url}`));

// Add all handlers to the router for each agent
for (const agent of agents) {
    router.addHandler(agent.url, async (ctx) => {
        const proxies = await agent.controller(ctx);
        Store.add(proxies);
        log.debug(`${proxies.length} proxies scraped from ${ctx.request.url}`);
    });
}
