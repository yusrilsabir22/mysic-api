import { strDurationToNumber } from "../utils/utils";

interface IBaseExtractor {
    getData(): void;
    getContinuation(): void;
}

export abstract class BaseExtractor implements IBaseExtractor{
    protected readonly data: any
    constructor(data: any) {
        this.data = data;
    }
    getData(): void {
        throw new Error("Method not implemented.");
    }
    getContinuation(): void {
        throw new Error("Method not implemented.");
    }
}

export abstract class BaseElementExtractor {
    private _videoId: string | undefined;
    private _title: string | undefined;
    private _subtitle: string | undefined;
    private _duration: string | undefined;
    private _browseId: string | undefined;
    private _params: string | undefined;
    private _thumbnails: Thumbnail[] | undefined;
    private _color: string | undefined

    public get videoId(): string | undefined{
        return this._videoId;
    }

    public get title(): string | undefined {
        return this._title;
    }

    public get subtitle(): string | undefined{
        return this._subtitle;
    }

    public get browseId(): string | undefined{
        return this._browseId;
    }

    public get params(): string | undefined {
        return this._params;
    }

    public get duration(): string | undefined{
        return this._duration;
    }

    public get thumbnails(): Thumbnail[] | undefined {
        return this._thumbnails;
    }

    public get color(): string | undefined {
        return this._color
    }

}

type Thumbnail = {
    url: string;
    width: number;
    height: number;
}


export class ExtractorMusicTwoRowItemRenderer extends BaseElementExtractor {
    private readonly _data: any;
    constructor(data: any) {
        super();
        this._data = data;
    }

    public get videoId(): string | undefined {
        return this._data.playlistItemData?.videoId || this._data.navigationEndpoint?.watchEndpoint?.videoId;
    }

    public get subtitle(): string | undefined {
        return !!this._data.flexColumns
            && this._data.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text
            || this._data.subtitle.runs.map((v: { text: string }) => v.text).join('')
    }

    public get title(): string | undefined {
        return this._data.title.runs[0].text
    }

    public get thumbnails(): { url: string; width: number; height: number; }[] | undefined {
        return this._data.thumbnailRenderer?.musicThumbnailRenderer?.thumbnail?.thumbnails
    }

    public get browseId(): string | undefined {
        return this._data.navigationEndpoint.browseEndpoint?.browseId
    }

    public get params(): string | undefined {
        return this._data.navigationEndpoint.browseEndpoint?.params
    }
}

export class ExtractorMusicResponsiveListItemRenderer extends BaseElementExtractor {
    private readonly _data: any;
    constructor(data: any) {
        super();
        this._data = data;
    }

    public get videoId(): string | undefined {
        return this._data.playlistItemData?.videoId;
    }

    public get subtitle(): string | undefined {
        const base = this._data.flexColumns[1].musicResponsiveListItemFlexColumnRenderer?.text?.runs

        return !!base ? base.map((v: any) => v.text).join('') : undefined
    }

    public get title(): string | undefined {
        return this._data.flexColumns[0].musicResponsiveListItemFlexColumnRenderer?.text?.runs?.map((v: { text: string }) => v.text).join('')
    }

    public get thumbnails(): { url: string; width: number; height: number; }[] | undefined {
        return this._data.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails
    }

    public get duration(): string | undefined {
        const base = this._data.flexColumns[1].musicResponsiveListItemFlexColumnRenderer?.text?.runs
        let d = (!!this._data.fixedColumns && this._data.fixedColumns[0].musicResponsiveListItemFixedColumnRenderer?.text?.runs[0]?.text) ||
            (!!base && base[base.length - 1].text)
        if (strDurationToNumber(d)) {
            return d
        }
    }
}

export class ExtractorNextDataQuery extends BaseElementExtractor {
    private readonly _data: any;
    constructor(data: any) {
        super();
        this._data = data;
    }

    public get videoId(): string | undefined {
        return this._data.playlistItemData?.videoId;
    }

    public get subtitle(): string | undefined {
        return this._data.flexColumns![1].musicResponsiveListItemFlexColumnRenderer?.text?.runs![0].text
    }

    public get title(): string | undefined {
        return this._data.flexColumns![0].musicResponsiveListItemFlexColumnRenderer?.text?.runs![0].text
    }

    public get thumbnails(): { url: string; width: number; height: number; }[] | undefined {
        return this._data.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails
    }
}

export class ExtractorMusicNavigationButtonRenderer extends BaseElementExtractor {
    private readonly _data: any;
    constructor(data: any) {
        super();
        this._data = data;
    }

    public get title(): string | undefined {
        return this._data.buttonText.runs[0].text
    }

    public get color(): string | undefined {
        return this._data.solid.leftStripeColor ? "#" + this._data.solid.leftStripeColor.toString(16) : undefined
    }

    public get browseId(): string | undefined {

        return this._data.clickCommand.browseEndpoint.browseId
    }

    public get params(): string | undefined {
        return this._data.clickCommand.browseEndpoint.params
    }
}
