import { Cache } from "./config/cache";
import init from "./config/init";

import { DebugControllers } from "./controllers/debug";
import { Server } from "./server";
import ytdl from "ytdl-core";
import fs from 'fs';
import {BrowseControllersV2, ExplorerController, HomeControllersV2, SearchControllersV2} from './controllers'

const cache = new Cache()
const server = new Server()
init(cache, false)

server.configureMiddleware()
server.app.get('/', (req, res) => {
    const str = fs.readFileSync('test.json', {encoding: "utf-8"});
    res.json(JSON.parse(str));
})

server.app.get('/v2/home', HomeControllersV2(cache))
server.app.get('/v2/browse', BrowseControllersV2(cache))
server.app.get('/v2/search', SearchControllersV2(cache))
server.app.get('/v2/explorer', ExplorerController(cache))
server.app.get('/v2/debug/browse', DebugControllers(cache))

server.app.get('/v2/play', async (req, res) => {
    if (!req.query.id) {
        res.status(422).json({ 'error': 'params required' })
        return
    }
    const info = await ytdl.getInfo(req.query.id as string)
    const audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' })
    res.json(audioFormat)
});
server.app.get('/play', async (req, res) => {
    if(!req.query.id) {
        res.status(422).json({'error': 'params required'})
        return
    }
    const info = await ytdl.getInfo(req.query.id as string)
    const audioFormat = ytdl.chooseFormat(info.formats, {quality: 'highestaudio'})
    res.json(audioFormat)
});

server.start()