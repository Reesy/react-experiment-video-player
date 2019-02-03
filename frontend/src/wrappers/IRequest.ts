import { IRequestOptions } from "./IRequestOptions";

export interface IRequest
{

    get(uri: string, options: IRequestOptions): Promise<any>

    post(uri: string, options: IRequestOptions): Promise<any>

    put(uri: string, options: IRequestOptions): Promise<any>

    delete(uri: string, options: IRequestOptions): Promise<any>
}