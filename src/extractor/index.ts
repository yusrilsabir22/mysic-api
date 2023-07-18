import { returnData } from "../utils/utils";
import { BaseExtractor, ExtractorMusicTwoRowItemRenderer, ExtractorMusicNavigationButtonRenderer, ExtractorMusicResponsiveListItemRenderer } from "./base";

export class Extractor extends BaseExtractor {
    useCache: boolean = false;
    constructor(data: any) {
        super(data);
    }

    getDefaultExplorer() {
        const root = this.data.contents.singleColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents
        const results = root.map((item: any) => {
            const baseRoot = item.musicCarouselShelfRenderer
            if(baseRoot == undefined) return undefined
            const section = baseRoot.header.musicCarouselShelfBasicHeaderRenderer.accessibilityData.accessibilityData.label
            
            const contents = baseRoot.contents.map((subItem: any) => {
                const musicTwoRowItemRenderer = subItem.musicTwoRowItemRenderer
                const musicResponsiveListItemRenderer = subItem.musicResponsiveListItemRenderer
                const musicNavigationButtonRenderer = subItem.musicNavigationButtonRenderer
                if (musicTwoRowItemRenderer) return returnData(new ExtractorMusicTwoRowItemRenderer(musicTwoRowItemRenderer))
                if (musicResponsiveListItemRenderer) return returnData(new ExtractorMusicResponsiveListItemRenderer(musicResponsiveListItemRenderer))
                if (musicNavigationButtonRenderer) return returnData(new ExtractorMusicNavigationButtonRenderer(musicNavigationButtonRenderer))
            }).filter((item: any) => item != undefined)

            return {
                section,
                type: !!contents[0].color ? 'genre' : !!contents[0].browseId ? "browse" : "song",
                contents: contents,
            }
        })
        return results.filter((item: any) => item != undefined)
    }

    // when req query next & params
    getNextParamsExplorer() {
        let root = this.data.contents.singleColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents
        const results = root.map((item: any) => {
            let section;
            let baseRoot;
            let contents;
            const musicCarouselShelfRenderer = item.musicCarouselShelfRenderer
            const gridRenderer = item.gridRenderer

            if(musicCarouselShelfRenderer) {
                baseRoot = musicCarouselShelfRenderer
                section = musicCarouselShelfRenderer.header.musicCarouselShelfBasicHeaderRenderer.accessibilityData.accessibilityData.label
                contents = baseRoot.contents.map((subItem: any) => {
                    const musicTwoRowItemRenderer = subItem.musicTwoRowItemRenderer
                    if (musicTwoRowItemRenderer) return returnData(new ExtractorMusicTwoRowItemRenderer(musicTwoRowItemRenderer))
                }).filter((it: any) => it != undefined)
            }

            if(gridRenderer) {
                baseRoot = gridRenderer
                section = gridRenderer.header.gridHeaderRenderer.title.runs[0].text
                contents = baseRoot.items.map((subItem: any) => {
                    const musicTwoRowItemRenderer = subItem.musicTwoRowItemRenderer
                    if (musicTwoRowItemRenderer) return returnData(new ExtractorMusicTwoRowItemRenderer(musicTwoRowItemRenderer))
                }).filter((it: any) => it != undefined)
            }
            if(!baseRoot) {
                return null
            }  
           
            return {
                section,
                type: contents[0].browseId ? "browse" : "song",
                contents,
            }
        })
        return results.filter((item: any) => item != null)
    }

    getNextExplorer() {
        const base = this.data.contents.singleColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents[0];
        let root;
        if (base.musicShelfRenderer) {
            root = base.musicShelfRenderer.contents;
        } else {
            root = base.musicPlaylistShelfRenderer.contents;
        }
        const continuation = root.continuations != undefined ? root.sectionListRenderer.continuations[0].nextContinuationData.continuation : undefined
        const results: ExtractorMusicResponsiveListItemRenderer[] = root.map((item: any) => new ExtractorMusicResponsiveListItemRenderer(item.musicResponsiveListItemRenderer))
        return {
            type: results[0].browseId != undefined ? 'browse' : 'song',
            contents: results.map(returnData),
            continuation
        }
    }

    getSuggestionData() {
        const root = this.data.contents.singleColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents;
        const continuation = this.data.contents.singleColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.continuations[0].nextContinuationData.continuation;
        const results = root.map((item: any) => {
            const text = item.musicCarouselShelfRenderer?.header.musicCarouselShelfBasicHeaderRenderer.title.runs[0].text
            const contents= item.musicCarouselShelfRenderer?.contents.map((val: any) => {
                if (val.musicResponsiveListItemRenderer) return new ExtractorMusicResponsiveListItemRenderer(val.musicResponsiveListItemRenderer)
                if (val.musicTwoRowItemRenderer) return new ExtractorMusicTwoRowItemRenderer(val.musicTwoRowItemRenderer)
            }).filter((item: any) => item != undefined)
            return contents != undefined && {
                section: text,
                type: contents[0].browseId != undefined ? 'browse' : 'song',
                contents: contents.map(returnData)
            }
        })
        return {
            data: results.filter((item: any) => item.section != undefined),
            continuation
        }
    }

    getContinuationData() {
        const root = this.data.continuationContents.sectionListContinuation.contents;
        const continuation = this.data.continuationContents.sectionListContinuation.continuations[0].nextContinuationData.continuation
        const results: { text: string, contents: ExtractorMusicTwoRowItemRenderer[] }[] = root.map((item: any) => {
            const text: string = item.musicCarouselShelfRenderer.header?.musicCarouselShelfBasicHeaderRenderer.title.runs[0].text
            
            const contents: ExtractorMusicTwoRowItemRenderer[] = item.musicCarouselShelfRenderer.contents.map((val: any) => {
                const musicTwoRowItemRenderer = val.musicTwoRowItemRenderer
                const musicResponsiveListItemRenderer = val.musicResponsiveListItemRenderer

                if (!!musicTwoRowItemRenderer) return new ExtractorMusicTwoRowItemRenderer(musicTwoRowItemRenderer)
                if (!!musicResponsiveListItemRenderer) return new ExtractorMusicResponsiveListItemRenderer(musicResponsiveListItemRenderer)
            })
            return {
                section: text,
                type: contents[0].browseId != undefined ? 'browse' : 'song',
                contents: contents.map(returnData),
            }
        })
        return {
            data: results,
            continuation
        }
    }

    getNextData() {
        const base = this.data.contents.singleColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents[0];
        let root;
        if (base.musicShelfRenderer) {
            root = base.musicShelfRenderer.contents;
        } else {
            root = base.musicPlaylistShelfRenderer.contents;
        }
        const continuation = root.continuations != undefined ? root.sectionListRenderer.continuations[0].nextContinuationData.continuation : undefined
        const results: ExtractorMusicResponsiveListItemRenderer[] = root.map((item: any) => new ExtractorMusicResponsiveListItemRenderer(item.musicResponsiveListItemRenderer))
        return {
            type: results[0].browseId != undefined ? 'browse' : 'song',
            contents: results.map(returnData),
            continuation
        }
    }

    getDefaultSearch() {
        const root = this.data.contents.tabbedSearchResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents;
        const results = root.filter((item: any) => item.musicShelfRenderer?.title.runs[0].text == 'Songs').map((item: any) => {
            const nextAction = {
                next: item.musicShelfRenderer?.bottomEndpoint.searchEndpoint.params,
                q: item.musicShelfRenderer?.bottomEndpoint.searchEndpoint.query
            }
            const contents = item.musicShelfRenderer.contents.map((val: any) => {
                const data = new ExtractorMusicResponsiveListItemRenderer(val.musicResponsiveListItemRenderer);
                return returnData(data)
            })
            return {
                contents,
                nextAction
            }
        })
        return results[0]
    }

    getNextSearch() {
        const root = this.data.contents.tabbedSearchResultsRenderer.tabs[0].tabRenderer
            .content.sectionListRenderer.contents;
        const continuation = this.data.contents.tabbedSearchResultsRenderer.tabs[0].tabRenderer.content
            .sectionListRenderer.contents[0].musicShelfRenderer.continuations[0].nextContinuationData.continuation
        const results = root.filter((item: any) => item.musicShelfRenderer?.title.runs[0].text == 'Songs').map((item: any) => {
            const contents = item.musicShelfRenderer.contents.map((val: any) => {
                const data = new ExtractorMusicResponsiveListItemRenderer(val.musicResponsiveListItemRenderer);
                return returnData(data)
            })
            return {
                contents,
                nextAction: {ct: continuation}
            }
        })
        return results[0]
    }

    getContinuationSearch() {
        const root = this.data.continuationContents.musicShelfContinuation.contents;
        const continuation = this.data.continuationContents.musicShelfContinuation.continuations[0].nextContinuationData.continuation;
        const contents = root.map((item: any) => returnData(new ExtractorMusicResponsiveListItemRenderer(item.musicResponsiveListItemRenderer)))
        return {
            contents,
            nextAction: {ct: continuation},
        }
    }
}