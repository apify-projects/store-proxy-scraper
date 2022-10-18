import { generateAgent } from '../utils/generateAgent.js';
import type { Controller } from '../types/agent.js';

const controller: Controller = ({ $ }) => {
    return [...$('tbody tr')].map((item) => {
        const elem = $(item);

        const host = elem.find('td:first-child').text().trim();
        const port = elem.find('td:nth-child(2)').text().trim();

        return {
            host,
            port,
            full: `${host}:${port}`,
            anonymity: elem.find('td:nth-child(3)').text().toLowerCase(),
            protocol: null,
            country: elem.find('td:nth-child(4)').text().toLowerCase(),
        };
    });
};

export const proxy11One = generateAgent('https://proxy11.com/', controller);
export const proxy11Two = generateAgent('https://proxy11.com/free-proxy', controller);
