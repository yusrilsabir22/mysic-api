import { Cache } from "./config/cache";
import init from "./config/init";

import { Server } from "./server";
import swaggerUi from 'swagger-ui-express'
import defaultRouter from "./routes"

(async () => {
    const server = new Server()
    await server.start()
})()
