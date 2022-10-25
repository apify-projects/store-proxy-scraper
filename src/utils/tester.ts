import { define } from 'nanolith';
import check from '@devhigley/test-proxy';
import { Actor } from 'apify';
import { log } from 'crawlee';
import { threadId } from 'worker_threads';

import type { InputSchema } from '../types/input.js';
import type { Proxy } from '../types/proxy.js';

// ! the api behind this could be used in the future
// ! https://proxyscrape.com/online-proxy-checker
const runTest = async ({ host, port }: { host: string; port: string }) => {
    return new Promise((resolve, reject) => {
        (async () => {
            try {
                const timeout = setTimeout(() => {
                    reject(new Error('Reached 20s timeout'));
                }, 20e3);

                const data = await check({
                    host,
                    port: +port,
                });

                clearTimeout(timeout);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        })();
    }) as ReturnType<typeof check>;
};

export const tester = await define({
    __initializeService: async () => {
        const { debug } = (await Actor.getInput<InputSchema>()) ?? {};
        if (debug) log.setLevel(log.LEVELS.DEBUG);
        log.debug(`Initialized testing service on thread: ${threadId}`);
    },
    test: async (proxies: Proxy[]) => {
        const id = Math.floor(Math.random() * 1e4);
        const promises = proxies.map((proxy) => {
            const { full, port, host, protocol, ...rest } = proxy;

            return (async function send(retries = 0): Promise<Proxy | null> {
                try {
                    const data = await runTest({ host, port });
                    log.debug(`${id}: Proxy ${full} passed test.`);
                    // log.info('success');

                    return {
                        host,
                        port,
                        full,
                        protocol: protocol || data?.type,
                        ...rest,
                    };
                } catch (error) {
                    // log.debug(`Proxy ${full} failed test: ${(error as { error: string }).error ?? (error as Error).message}`);
                    // ? This allows for retry functionality if needed in the future
                    if (retries >= 0) return null;
                    return send(retries + 1);
                }
            })();
        });

        const set = new Set(await Promise.all(promises));
        set.delete(null);

        // console.log(`${id}: Finished tests with ${set.size}`);
        log.debug(`${id}: Finished tests with ${set.size}`);
        return [...set] as Proxy[];
    },
});
