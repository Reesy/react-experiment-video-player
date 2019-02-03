

export interface IRequestOptions
{
    baseUrl?: string;
    host?: string;
    port?: number;
    method?: string;
    headers?: Headers;
    body?: any;
    encoding?: string | null;
    timeout?: number
}