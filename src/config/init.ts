import Miniget from "miniget"
import * as cheerio from 'cheerio'
import vm from 'vm'
import {Cache} from './cache'
import { INNERTUBE_API_KEY, INNERTUBE_CONTEXT, VISITOR_DATA, YTMUSIC_INITIAL_DATA } from "../types/api"
import fs from 'fs'

const DEFAULT_URL = 'https://music.youtube.com'

export default async (cache: Cache, debug: boolean = false) => {
    // Default cookie
    let cookies: string = '';
    let response: string = '';
    if(debug) {
        cookies = '',
        response = fs.readFileSync('test.html', { encoding: 'utf8' })
    } else {
        const resp = await getHTMLAndCookie()
        cookies = resp.cookies
        response = resp.response
    }
    const script = extractScript(response)
    const ytdata = getData(script)
    cache.set('cookies', cookies)
    cache.set(INNERTUBE_API_KEY, ytdata[INNERTUBE_API_KEY])
    cache.set(INNERTUBE_CONTEXT, ytdata[INNERTUBE_CONTEXT])
    cache.set(VISITOR_DATA, ytdata[VISITOR_DATA])

    // Initial Data
    let initialData = JSON.parse(ytdata[YTMUSIC_INITIAL_DATA][1].data)
    cache.set(YTMUSIC_INITIAL_DATA, initialData)
}

const getHTMLAndCookie = async () => {
    let cookies = '_gcl_au=1.1.933766712.1686795202; '
    const resp = await Miniget(DEFAULT_URL, {
        // agent,
        headers: {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
        },
    }).on('response', res => {
        for (let i = 0; i < res.rawHeaders.length; i++) {
            const val = res.rawHeaders[i]
            if (val == 'Set-Cookie') {
                cookies += `${res.rawHeaders[i + 1].split(';')[0]}; `
            }
        }
    }).text()
    return {
        response: resp,
        cookies
    }
}

const extractScript = (html: string) => {
    const $ = cheerio.load(html)
    let script = ``
    $('script').map((i,el) => {
        const d: any = el.children[0]
        if (i==0) return
        if (d && d.data && /ytcfg.set/i.exec(d.data) != null) {
            script += `\n${d.data};\n`
        }
    })
    return script
}

const getData = (script: string) => {
    const yt = {config_: {}}
    const ytcfg = {data_: {}}
    const window: any = {
        window: {
            ytcfg: {
                d: function () { return window.yt && yt.config_ || ytcfg.data_ || (ytcfg.data_ = {}) },
                set: function () {
                    var a = arguments;
                    if (a.length > 1)
                        window.ytcfg.d()[a[0]] = a[1];
                    else {
                        var k;
                        for (k in a[0])
                            window.ytcfg.d()[k] = a[0][k]
                    }
                }
            }
        },
        
    }
    vm.createContext(window)
    vm.runInContext(script, window)
    return window.ytcfg.d()
}