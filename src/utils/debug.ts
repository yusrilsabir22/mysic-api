import Miniget from "miniget"
import fs from 'fs'
import * as cheerio from 'cheerio'
import vm from 'vm'
import {HttpProxyAgent} from 'http-proxy-agent'
import { data } from "cheerio/lib/api/attributes"

(async () => {
    const proxy = ''
    let cookies = '_gcl_au=1.1.1504724605.1686614708; '
    const agent = new HttpProxyAgent(proxy)
    const resp = await Miniget('https://music.youtube.com', {
        // agent,
        headers: {
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
        },
        timeout: 30000
    }).on('response', res => {
        for(let i = 0; i < res.rawHeaders.length; i++) {
            const val = res.rawHeaders[i]
            if(val == 'Set-Cookie') {
                cookies+=`${res.rawHeaders[i+1].split(';')[0]}; `
            }
        }
    }).text()
    console.log(cookies)
    // const $ = cheerio.load(resp)
    // let at = ``
    // $('script').map((i,el) => {
    //     const d: any = el.children[0]
    //     if (i==0) return
    //     if (d && d.data && /ytcfg.set/i.exec(d.data) != null) {
    //         // const ix = /ytcfg.set/i.exec(d.data)!.index
    //         // console.log(d.data)
    //         // const lPos = match!.index + match![0].length
    //         // const body = d.data.slice(lPos)
    //         // // console.log(body)
    //         // const match2 = /;window.ytcfg.obfuscatedData_/i.exec(d.data)
    //         // const rPos = match2!.index
    //         // let ix = d.data.slice(lPos+1, rPos-1)
    //         // // console.log(Object.keys(JSON.parse(ix)))
    //         // // data = data.slice(1, data.length-1)
    //         // // console.log(JSON.parse(data))
    //         // fs.writeFileSync(`test-${i}.txt`, d.data)
    //         at += `\n${d.data};\n`
    //     }
    // })

    // const yt = {config_: {}}
    // const ytcfg = {data_: {}}
    // const window: any = {
    //     window: {
    //         ytcfg: {
    //             d: function () { return window.yt && yt.config_ || ytcfg.data_ || (ytcfg.data_ = {}) },
    //             set: function () {
    //                 var a = arguments;
    //                 if (a.length > 1)
    //                     window.ytcfg.d()[a[0]] = a[1];
    //                 else {
    //                     var k;
    //                     for (k in a[0])
    //                         window.ytcfg.d()[k] = a[0][k]
    //                 }
    //             }
    //         }
    //     },
        
    // }

    // vm.createContext(window)
    // vm.runInContext(at, window) 
    // fs.writeFileSync('a.json', JSON.stringify(window.ytcfg.d().YTMUSIC_INITIAL_DATA))
    // fs.writeFileSync('test1234.txt', at)
})()