import { DataSource } from "typeorm"
import {config} from "dotenv"
import { Lyrics } from "../entities/Lyrics"
import { Song } from "../entities/Song"
import path from 'path'

config()

export default new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT!),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: false,
    logging: false,
    entities: [
        Song,
        Lyrics
    ],
    migrations: [
        path.resolve(__dirname, "..", "migrations", "*")
    ],
    subscribers: [],
})