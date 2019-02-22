import { IsubtitleBuilder } from "./interfaces/IsubtitleBuilder";
import { Subtitle } from "../../sharedInterfaces/Subtitle";
import path = require('path');


export class subtitleBuilder implements IsubtitleBuilder
{
    private fileName: string;
    private directory: string
    constructor(__fileName: string, __directory: string)
    {
        this.fileName = __fileName;
        this.directory = __directory;
    }

    public buildSubtitle(): Subtitle
    {
        let subtitleName = this.buildSubtitleName();
        let subtitlePath = this.buildSubtitlePath();
        let subtileLanguage = this.buildSubtitleLanguage();
        let subtitleTarget = this.buildSubtitleTarget();
        let subtitle: Subtitle = 
        {
            name: subtitleName,
            path: subtitlePath,
            language: subtileLanguage,
            target: subtitleTarget
        }
        return subtitle;

    }

    /**
     * @private
     * @name buildSubtitleName
     * @description This will return the subtitle name including extensions
     */
    private buildSubtitleName(): string
    {
        return this.fileName;
    }

    /**
     * @private
     * @name buildSubtitlePath 
     * @description This will return the full path of the file on the host server
     */
    private buildSubtitlePath(): string
    {
        return path.join(this.directory, this.fileName);
    }

    /**
     * @private 
     * @name buildSubtitleLanguage
     * @description From the filename, this will determine the language of the subtitle by scanning the string
     *              for an ISO 639-1 or ISO 639-2 compliant code, if none is found it will return unknown. 
     */
    private buildSubtitleLanguage(): string
    {
        return ''
    }

    /**
     * @private
     * @name buildSubtitleTarget
     * @description This will return the stripped filename without any extension to more easily map subtitles 
     *              to it's target video.
     */
    private buildSubtitleTarget(): string
    {
        return ''
    }

};