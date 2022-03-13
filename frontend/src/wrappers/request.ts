import axios, { AxiosRequestConfig } from 'axios';
import { IRequestOptions } from './IRequestOptions';
import { IRequest } from './IRequest';
/**
 * Small wrapper around request promise. 
 */
export class request implements IRequest
{
    
    /**
     * 
     * @param {string} uri
     * @param {IRequestOptions} options 
     */
    async get(uri: string, options: IRequestOptions)
    {
        this.validateURI(uri);
        let transformedOptions = this.tranformOptions(options);
        return axios.get(uri, transformedOptions);
    }

    /**
     * 
     * @param {string} uri 
     * @param {IRequestOptions} options 
     */
    async post(uri: string, data: any, options: IRequestOptions)
    {
        this.validateURI(uri);
        let transformedOptions = this.tranformOptions(options);
        return axios.post(uri, data, transformedOptions);
    }
    
    /**
     * 
     * @param {string} uri 
     * @param {IRequestOptions} options 
     */
    async put(uri: string, options: IRequestOptions)
    {
        this.validateURI(uri);
        let transformedOptions = this.tranformOptions(options);
        return axios.put(uri, transformedOptions);
    }

    /**
     * 
     * @param {string} uri 
     * @param {IRequestOptions} options 
     */
    async delete(uri: string, options: IRequestOptions)
    {
        this.validateURI(uri);
        let transformedOptions = this.tranformOptions(options);
        return axios.delete(uri, transformedOptions);
    }

    /**
     * 
     * @param {string} uri 
     */
    private validateURI(uri: string)
    {
        if(typeof(uri) === "undefined" || uri === "")
        {
            throw new Error("URI is mising in request"); 
        }

        return;

    }

    /**
     * @description Transforms 
     * @param {IRequestOptions} options 
     */
    private tranformOptions(options: IRequestOptions): AxiosRequestConfig
    {
        return options as AxiosRequestConfig;
    }
}