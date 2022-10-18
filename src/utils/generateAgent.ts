import type { GenerateAgent } from '../types/agent.js';

export const generateAgent: GenerateAgent = (url, controller, options = {}) => ({
    url,
    controller,
    options,
});
