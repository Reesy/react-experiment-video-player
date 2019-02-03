import * as rp from 'request-promise-native';
import { IRequestOptions } from './IRequestOptions';
import { IRequest } from './IRequest';
/**
 * Small wrapper around request promise. 
 */
export class request implements IRequest
{
    constructor()
    {

    }
    
    /**
     * 
     * @param {string} uri
     * @param {IRequestOptions} options 
     */
    async get(uri: string, options: IRequestOptions)
    {
        this.validateURI(uri);
        let transformedOptions = this.tranformOptions(options);
        return rp.get(uri, transformedOptions);
    }

    /**
     * 
     * @param {string} uri 
     * @param {IRequestOptions} options 
     */
    async post(uri: string, options: IRequestOptions)
    {
        this.validateURI(uri);
        let transformedOptions = this.tranformOptions(options);
        return rp.post(uri, transformedOptions);
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
        return rp.put(uri, transformedOptions);
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
        return rp.delete(uri, transformedOptions);
    }

    /**
     * 
     * @param {string} uri 
     */
    private validateURI(uri: string)
    {
        if(typeof(uri) === "undefined" || uri === "")
        {
            throw "URI is mising in request";
        }

        return;

    }

    /**
     * @description Transforms 
     * @param {IRequestOptions} options 
     */
    private tranformOptions(options: IRequestOptions): rp.RequestPromiseOptions
    {
        return <rp.RequestPromiseOptions>options;
    }
}