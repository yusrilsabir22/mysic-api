import internal, { PassThrough } from "stream";
import { Cache } from "../config/cache";
import { BaseElementExtractor } from "../extractor/base";
import { INNERTUBE_API_KEY, INNERTUBE_CONTEXT, VISITOR_DATA } from "../types/api";

export const strDurationToNumber = (duration?: string) => {
    if(!duration) {
        return '00:00'
    }
    let p = duration.split('.').length > 1 ? duration.split('.') : duration.split(':');
    let s = 0;
    let m = 1;

    while (p.length > 0) {
        s += m * parseInt(p.pop()!, 10);
        m *= 60;
    }

    return s;
}

export const mapping = (elements: BaseElementExtractor[]) => {
    for (const element of elements) {
        const type = element.browseId != undefined && "browse" || "song"
        console.log(type)
    }
}

export const getType = (elements: BaseElementExtractor[]) => {
    let type = 'browse';
    for (const element of elements) {
        type = element.browseId != undefined && "browse" || "song"
    }
    return type;
}

export const returnData = (item: BaseElementExtractor) => {
    if (item.thumbnails && item.thumbnails.length > 0) {
        const w = item.thumbnails.at(-1)?.width
        const h = item.thumbnails.at(-1)?.height
        const url = item.thumbnails.at(-1)?.url.replace(`w${w}-h${h}`, "w720-h720")
        item.thumbnails.push({
            url: url!,
            width: 720,
            height: 720
        })
    }
    if (item.videoId) {
        const r = {
            videoId: item.videoId,
            title: item.title,
            subtitle: item.subtitle,
            thumbnails: item.thumbnails,
        }

        if(item.duration) {
            Object.assign(r, {duration: item.duration,
            totalDuration: strDurationToNumber(item.duration!)})
        }
        return r
    }
    
    return {
        title: item.title,
        browseId: item.browseId,
        params: item.params,
        subtitle: item.subtitle,
        thumbnails: item.thumbnails,
        color: item.color
    }
}

/**
 * 
 * @param cache 
 * @param query is query from request query params
 * @param url default is https://music.youtube.com/youtubei/v1/browse
 * @returns 
 */
export const fetchBrowseAPI = (cache: Cache, query: any, url: string = "https://music.youtube.com/youtubei/v1/browse") => {
    const context = cache.get(INNERTUBE_CONTEXT)
    const apiKey = cache.get(INNERTUBE_API_KEY)
    const cookies = cache.get('cookies')
    const visitorId = cache.get(VISITOR_DATA)

    let reqBody: any = {
        context: context
    }

    const uri = new URL(url)
    const {ct, next, params} = query

    if (!!next) {
        reqBody.browseId = next
    }

    if(!!params) {
        reqBody.params = encodeURI(params as string);
    }

    if (!!ct) {
        uri.searchParams.append('ctoken', ct as string);
        uri.searchParams.append("continuation", ct as string);
        uri.searchParams.append("type", 'next');
    }

    uri.searchParams.append("key", apiKey);
    uri.searchParams.append("prettyPrint", "false");

    return fetch(
        uri.toString(),
        {
            method: "POST",
            body: JSON.stringify(reqBody),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                'Accept-Language': 'en-US,en;q=0.9',
                cookie: cookies,
                'x-goog-visitor-id': visitorId,
                'sec-ch-ua': '"Chromium";v="113", "Not-A.Brand";v="24"',
                'sec-ch-ua-arch': "x86",
                'sec-ch-ua-bitness': "64",
                'sec-ch-ua-full-version': "114.0.5735.90",
                'sec-ch-ua-full-version-list': '"Chromium";v="114.0.5735.90", "Not-A.Brand";v="24.0.0.0"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-model': "",
                'sec-ch-ua-platform': "Windows",
                'sec-ch-ua-platform-version': "10.0.0",
                'sec-ch-ua-wow64': '?0',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'same-origin',
                'sec-fetch-site': 'same-origin',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
                'x-youtube-bootstrap-logged-in': 'false',
                'x-youtube-client-name': '67',
                'x-youtube-client-version': '1.20230605.01.01,'
            },
        }
    );
}

export const fetchSearchAPI = async (cache: Cache, query: any) => {
    const context = cache.get(INNERTUBE_CONTEXT)
    const apiKey = cache.get(INNERTUBE_API_KEY)
    const visitorId = cache.get(VISITOR_DATA)
    const cookies = cache.get('cookies')
    const { next, ct, q } = query

    const requestBody: any = {
        context: context,
        query: q,
        suggestStats: {
            validationStatus: "VALID",
            parameterValidationStatus: "VALID_PARAMETERS",
            clientName: "youtube-music",
            searchMethod: "ENTER_KEY",
            inputMethod: "KEYBOARD",
            originalQuery: q,
            availableSuggestions: [
                {
                    index: 0,
                    suggestionType: 0,
                },
                {
                    index: 1,
                    suggestionType: 0,
                },
                {
                    index: 2,
                    suggestionType: 0,
                },
                {
                    index: 3,
                    suggestionType: 0,
                },
                {
                    index: 4,
                    suggestionType: 46,
                },
                {
                    index: 5,
                    suggestionType: 46,
                },
                {
                    index: 6,
                    suggestionType: 46,
                },
            ],
            zeroPrefixEnabled: true,
            firstEditTimeMsec: 8087,
            lastEditTimeMsec: 12409,
        },
    };

    if (!!next) {
        requestBody.params = next
    }

    const url = new URL("https://music.youtube.com/youtubei/v1/search");
    url.searchParams.append('key', apiKey)
    url.searchParams.append("prettyPrint", 'false');
    if (!!ct) {
        url.searchParams.append('ctoken', ct as string)
        url.searchParams.append("continuation", ct as string);
        url.searchParams.append("type", "next");
    }
    const data = await fetch(
        url.toString(),
        {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                cookie: cookies,
                'x-goog-visitor-id': visitorId,
                'sec-ch-ua': '"Chromium";v="113", "Not-A.Brand";v="24"',
                'sec-ch-ua-arch': "x86",
                'sec-ch-ua-bitness': "64",
                'sec-ch-ua-full-version': "113.0.5672.63",
                'sec-ch-ua-full-version-list': '"Chromium";v="113.0.5672.63", "Not-A.Brand";v="24.0.0.0"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-model': "",
                'sec-ch-ua-platform': "Windows",
                'sec-ch-ua-platform-version': "10.0.0",
                'sec-ch-ua-wow64': '?0',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'same-origin',
                'sec-fetch-site': 'same-origin',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
                'x-youtube-bootstrap-logged-in': 'false',
                'x-youtube-client-name': '67',
                'x-youtube-client-version': '1.20230605.01.01,'
            },
        }
    );
    return data
}

export function streamToBuffer(stream: PassThrough | internal.Writable) {
  const chunks: Buffer[] = []
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk: any) => chunks.push(Buffer.from(chunk)))
    stream.on('error', (err: any) => reject(err))
    stream.on('end', () => resolve(Buffer.concat(chunks)))
  })
}