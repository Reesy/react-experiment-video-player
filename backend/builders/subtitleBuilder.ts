import { IsubtitleBuilder } from "./interfaces/IsubtitleBuilder";
import { Subtitle } from "../../sharedInterfaces/Subtitle";
import path = require('path');
import {ISO6391, ISO6392} from "../constants/languages";

export class subtitleBuilder implements IsubtitleBuilder
{
    private fileName: string;
    private directory: string
    constructor(__fileName: string, __directory: string)
    {

        if(typeof(__fileName) === 'undefined' || __fileName === null || __fileName === '')
        {
            throw new Error('Invalid filename');
        }
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
        let languageCodeCapture = this.fileName.match(/[^.]([^.]*)/);
        if(languageCodeCapture === null)
        {
            return 'Unknown'
        }

        let languageCode = languageCodeCapture[0];
        console.log("Language code" + languageCodeCapture);
        if(languageCode.length === 2)
        {
            let result = Object.getPrototypeOf(ISO6391)[languageCode];
            return result;
        }
        else if(languageCode.length === 3)
        {
            let result = Object.keys(ISO6392).indexOf(languageCode);
            return result[name];
        }
        else 
        {
            return 'Unknown'
        }

        //If no letter between two dots
            //return 'Unknown'
        //If two letter 
            //look up ISO6391
        //If three letter
            //look up ISO6392
        //If neither
            //return 'Unknown'
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
        let target = this.fileName.match(/[^.]*/);

        if(target === null)
        {
            throw 'Subtitle target was undiscovered';
        }
        return target[0]
    }

};