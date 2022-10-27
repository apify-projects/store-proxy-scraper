import { generateAgent } from '../utils/generateAgent.js';
import type { Controller } from '../types/agent.js';
import { proxyDataFromTable } from '../utils/proxyDataFromTable.js';

const controller: Controller = ({ $ }) => {
    return proxyDataFromTable(
        { $, rows: 'tbody tr' },
        {
            host: 1,
            port: 2,
            anonymity: 3,
            country: 4,
            protocol: null,
        }
    );
};

export const proxy11One = generateAgent('https://proxy11.com/', controller);
export const proxy11Two = generateAgent('https://proxy11.com/free-proxy', controller);
