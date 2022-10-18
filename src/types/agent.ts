import { AllowedHttpMethods } from 'apify-client';
import { Awaitable, CheerioCrawlingContext } from 'crawlee';
import { RequestOptions } from 'https';
import { Proxy } from './proxy.js';

export type AgentOptions = {
    headers?: Record<string, string>;
    method?: AllowedHttpMethods;
};

export type Controller = (context: CheerioCrawlingContext) => Awaitable<Proxy[]>;

export type Agent = {
    url: string;
    controller: Controller;
    options: AgentOptions;
};

export type GenerateAgent = (url: string, controller: Controller, options?: AgentOptions) => Agent;
