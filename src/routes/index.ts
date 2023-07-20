import {Router} from "express"
import { BrowseControllersV2, ExplorerController, HomeControllersV2, HookControllers, LyricsControllers, PlayController, SearchControllersV2 } from "../controllers"
import { Cache } from "../config/cache"

const router = Router()

export default (cache: Cache) => {
    
    router.get('/home', HomeControllersV2(cache))
    router.get('/browse', BrowseControllersV2(cache))
    router.get('/search', SearchControllersV2(cache))
    router.get('/explorer', ExplorerController(cache))
    router.get("/play/:id", PlayController)
    router.post("/hook", HookControllers)
    router.get("/lyrics", LyricsControllers)
    return router
}