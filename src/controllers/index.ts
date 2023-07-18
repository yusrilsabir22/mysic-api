import { Request, Response } from "express";
import { Extractor } from "../extractor";
import { fetchBrowseAPI, fetchSearchAPI } from "../utils/utils";
import { Cache } from "../config/cache";
import { INNERTUBE_API_KEY, INNERTUBE_CONTEXT, VISITOR_DATA, YTMUSIC_INITIAL_DATA } from "../types/api";



export const BrowseControllersV2 = (cache: Cache) => async (req: Request, res: Response) => {
    const data = await fetchBrowseAPI(cache, req.query)
    const result: any = await data.json();
    try {
        const ext = new Extractor(result)
        if (!!req.query.next && !req.query.ct) {
            res.json(ext.getNextData())
        } else {
            res.json(ext.getContinuationData())
        }
    } catch (error) {
        console.log(error)
        res.json({ error: '' + error, msg: 'something went wrong' })
    }
}


export const HomeControllersV2 = (cache: Cache) => async (req: Request, res: Response) => {
    const initialData = cache.get(YTMUSIC_INITIAL_DATA)

    try {
        const ext = new Extractor(initialData)
        res.json(ext.getSuggestionData())

    } catch (error) {
        res.json({ error: error + "", msg: 'something went wrong' })
    }
}


export const SearchControllersV2 = (cache: Cache) => async (req: Request, res: Response) => {
    const data = await fetchSearchAPI(cache, req.query)
    const result = await data.json()
    if ((!!req.query.next && !!req.query.ct) || !req.query.q) {
        res.json({ error: 'invalid params' })
        return
    }
    try {
        const ext = new Extractor(result)
        let results;

        if (!!req.query.next) {
            results = ext.getNextSearch()
        } else if (!!req.query.ct) {
            results = ext.getContinuationSearch()
        } else {
            results = ext.getDefaultSearch()
        }
        res.json(results);
    } catch (error) {
        console.log(error)
        res.json({ error, msg: 'something went wrong' })
    }
}


export const ExplorerController = (cache: Cache) => async (req: Request, res: Response) => {
    const initialData = cache.get(YTMUSIC_INITIAL_DATA)

    const { ct, next, params, lazy } = req.query


    const context = cache.get(INNERTUBE_CONTEXT)
    const apiKey = cache.get(INNERTUBE_API_KEY)
    const cookies = cache.get('cookies')
    const visitorId = cache.get(VISITOR_DATA)

    let reqBody: any = {
        context: context
    }
    const url = new URL("https://music.youtube.com/youtubei/v1/browse");

    if (!!next) {
        reqBody.browseId = next
    } else {
        // Default
        reqBody.browseId = "FEmusic_explore"
    }

    if (!!params) {
        reqBody.params = encodeURI(params as string);
    }

    if (!!ct) {
        url.searchParams.append('ctoken', ct as string);
        url.searchParams.append("continuation", ct as string);
        url.searchParams.append("type", 'next');
    }

    url.searchParams.append("key", apiKey);
    url.searchParams.append("prettyPrint", "false");

    const data = await fetch(
        url.toString(),
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


    // res.json(result)
    try {
        const result: any = await data.json();
        const browseExtractor = new Extractor(result)
        if (!!next && !!params) {
            res.json({ data: browseExtractor.getNextParamsExplorer() })
            return
        } else if (!!next && !params) {
            res.json(browseExtractor.getNextExplorer())
            return
        }
        res.json({ data: browseExtractor.getDefaultExplorer() })

    } catch (error) {
        console.log(error)
        console.log(data.status)
        res.json({ error: '' + error, msg: 'something went wrong' })
    }
}