import { Actor } from 'apify';
import { log } from 'crawlee';
import { ServiceCluster } from 'nanolith';
import { TypedEmitter } from 'tiny-typed-emitter';
import type { Proxy } from '../types/proxy.js';
import { chunkArray } from './chunkArray.js';
import { tester } from './tester.js';

const PROXY_CACHE = 'PROXY-CACHE';

type ProxyCache = {
    queue: Proxy[];
    tracked: Record<string, 1>;
};

class ProxyStore extends TypedEmitter<{ pushing: () => void; pushed: () => void }> {
    #queue: Proxy[] = [];
    #tracked = new Map<string, 1>();
    #pushing = false;
    #interval: NodeJS.Timer | null = null;
    #migrating = false;
    #testOptions = {
        runTests: true,
    };
    #cluster = new ServiceCluster(tester);
    #kvStoreName = 'default';

    constructor() {
        super();
    }

    async init({ runTests, kvStoreName }: { runTests: boolean; kvStoreName: string }) {
        await Actor.init();

        this.#kvStoreName = kvStoreName;
        this.#testOptions = { runTests };

        // If we want to test the proxies, launch five services in the cluster
        if (runTests)
            await Promise.all(
                [...Array(5).keys()].map(() =>
                    this.#cluster.launchService({
                        // ! logs some weird exception
                        // exceptionHandler({ error }) {
                        //     log.error(`Unexpected exception caught in service:`);
                        //     console.log(error);
                        // },
                    })
                )
            );

        // Pull class property info from the cache (if it exists)
        await this.#updateFromCache();

        const migrationHandler = async () => {
            if (this.#pushing) return;
            this.#migrating = true;

            await this.#pushToCache();
        };

        const intervalHandler = async () => {
            if (this.#migrating) return;

            this.emit('pushing');
            this.#pushing = true;

            // Clear out the in-memory queue, filter out duplicates,
            // the push the proxies to the default dataset
            await this.#pushData();

            // Cache data about the store
            await this.#pushToCache();

            this.#pushing = false;
            this.emit('pushed');
        };

        // Push to the dataset, then to the cache
        this.#interval = setInterval(intervalHandler, 15e3);

        // Push to the cache and to the dataset at the same time.
        Actor.on('migrating', migrationHandler);
        Actor.on('aborting', migrationHandler);
    }

    async finish() {
        if (this.#testOptions.runTests) {
            const waitForIdleCluster = async (): Promise<void> => {
                // console.log(this.#cluster.activeServiceCalls);
                if (this.#cluster.activeServiceCalls === 0) {
                    return;
                }
                // Wait for 5 seconds before checking again
                await new Promise((resolve) => setTimeout(resolve, 5e3));
                return waitForIdleCluster();
            };

            log.info('Waiting for tests to finish.');
            await waitForIdleCluster();
            log.info('All tests finished.');
        }

        // Wait for pushing to complete
        await new Promise((resolve) => {
            this.on('pushed', () => resolve(true));
            if (!this.#pushing) resolve(true);
        });

        clearInterval(this.#interval!);

        await this.#pushData();
        log.info(`Finished with ${[...this.#tracked.keys()].length} total proxies${this.#testOptions.runTests ? ' (before tests)' : ''}.`);

        // Close all services
        await this.#cluster.closeAll();

        // Push a txt file to the key-value store
        const kvStore = await Actor.openKeyValueStore(this.#kvStoreName === 'default' ? undefined : this.#kvStoreName);
        const dataset = await Actor.openDataset();
        const { items, count } = await dataset.getData();

        log.info(`Saving ${count} proxies to a .txt file in the ${this.#kvStoreName} key-value store.`);
        await kvStore.setValue(
            'current-proxies-txt',
            (items as Proxy[]).reduce((acc, { full }) => acc.concat(`${full}\n`), ''),
            { contentType: 'text/plain' }
        );

        await Actor.exit();
    }

    add(proxies: Proxy[]) {
        const deDuped = proxies.filter((proxy) => {
            const key = proxy.full.trim();

            // Don't push the proxy to the queue if it's already been scraped
            if (this.#tracked.has(key)) return false;

            // Otherwise, mark the proxy as tracked and include it in the final list
            this.#tracked.set(key, 1);
            return true;
        });

        if (this.#testOptions.runTests && deDuped.length) {
            (async () => {
                // Ensure that a task only handles a maximum of 30 proxies at a
                // time. This enables better task management amongst the 5 services.
                const promises = chunkArray(deDuped, 30).flatMap((chunk) => {
                    return (async () => {
                        const proxies = await this.#cluster.use().call({
                            name: 'test',
                            params: [chunk],
                        });

                        this.#queue.push(...proxies);
                    })();
                });

                await Promise.all(promises);
            })();

            return;
        }

        this.#queue.push(...deDuped);
    }

    async #updateFromCache() {
        const data = await Actor.getValue<ProxyCache>(PROXY_CACHE);
        if (!data) return;

        this.#queue = data.queue;
        this.#tracked = new Map(Object.entries(data.tracked));
    }

    #createCache(): ProxyCache {
        return {
            queue: this.#queue,
            tracked: Object.fromEntries(this.#tracked),
        };
    }

    #pushToCache() {
        return Actor.setValue(PROXY_CACHE, this.#createCache());
    }

    #getQueue() {
        const copy = [...this.#queue];
        this.#queue = [];
        return copy;
    }

    async #pushData() {
        const data = this.#getQueue();
        if (!data.length) return;

        await Actor.pushData(data);
        log.info(`Pushed ${data.length === 1 ? `${data.length} proxy` : `${data.length} proxies`} to the dataset.`);
    }
}

export const Store = new ProxyStore();
