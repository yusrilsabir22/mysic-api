import { Request, Response } from "express";
import { Cache } from "../config/cache";
import { INNERTUBE_API_KEY, INNERTUBE_CONTEXT, VISITOR_DATA } from "../types/api";
import { writeFileSync } from "fs";
import * as cheerio from 'cheerio'
import vm from 'vm'
import Miniget from "miniget"

const getLyrics = async (url ="https://genius.com/Sza-kill-bill-lyrics") => {
    const result = await fetch(url)
    const html = await result.text()
    const $ = cheerio.load(html)
    let script = ``
    $('script').map((i, el) => {
        const d: any = el.children[0]
        if (i == 0) return
        if (d && d.data && /window.__PRELOADED_STATE__/i.exec(d.data) != null) {
            script += `\n${d.data};\n`
        }
    })
    const window: any = {
        JSON: {
            parse: JSON.parse
        },
        window: {}
    }
    writeFileSync("test123.html", script)
    vm.createContext(window)
    vm.runInContext(script, window)
    return window.window.__PRELOADED_STATE__
}

const getURL = async (q: string) => {
    const url = `https://genius.com/api/search/multi?per_page=5&q=${q}`
    const getURL = await fetch(url, {
        headers: {
            // 'Cookie': cookie,
            'User-Agent': 'Mozilla/5.0(Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.9",
            "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Google Chrome\";v=\"114\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest",
            "Referer": "https://genius.com/search?q=sza%20kill%20bill",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        }
    })
    const response = await getURL.json()
    return response.response.sections[0].hits[0].result.url
}

export const DebugControllers = (cache: Cache) => async (req: Request, res: Response) => {
    const url = await getURL('sza kill bill')
    const response = await getLyrics(url)
    const lyricsChildren = response.songPage.lyricsData.body.children
    const lyrics = lyricsExtractor(lyricsChildren)
    res.json(lyrics)
}

const timeout = (time=3) => {
    return new Promise((resolve) => {
        setTimeout(() => {resolve(null)}, time*1000)
    })
}

const lyricsExtractor = (lyrics: any) => {
    let l: any = []
    const a = {children: []}
    lyrics.map((item: any) => {
        if(typeof(item) == 'string') {
            l.push(item)
        }
        if (typeof(item) == 'object' && Object.keys(item)[0] == 'children') {
            l.push(...lyricsExtractor(item.children))
        }
    })
    return l
}