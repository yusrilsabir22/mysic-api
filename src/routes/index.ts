import {Router} from "express"
import { BrowseControllersV2, ExplorerController, HomeControllersV2, PlayController, SearchControllersV2 } from "../controllers"
import { Cache } from "../config/cache"

const router = Router()

export default (cache: Cache) => {
    
    router.get('/home', HomeControllersV2(cache))
    router.get('/browse', BrowseControllersV2(cache))
    router.get('/search', SearchControllersV2(cache))
    router.get('/explorer', ExplorerController(cache))
    router.get("/play", PlayController)
    return router
}