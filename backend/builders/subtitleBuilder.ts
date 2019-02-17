import { IsubtitleBuilder } from "./interfaces/IsubtitleBuilder";
import { Subtitle } from "../../sharedInterfaces/Subtitle";


export class subtitleBuilder implements IsubtitleBuilder
{
    private fileName: string = "";
    constructor(__fileName: string)
    {
        this.fileName = __fileName;
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

    private buildSubtitleName(): string
    {
        return ''
    }

    private buildSubtitlePath(): string
    {
        return ''
    }

    private buildSubtitleLanguage(): string
    {
        return ''
    }

    private buildSubtitleTarget(): string
    {
        return ''
    }

};