import { Request, Response } from "express";
import { getOne } from "../config/s3client";
import {config} from "dotenv"
import db from '../config/db'
import { Song } from "../entities/Song";
config()

export const LyricsControllers = async (req: Request, res: Response) => {

    const id = req.query.id as string
    const result = await db.getRepository(Song).findOne({
        where: {
            videoId: id
        },
        relations: {
            lyrics: true
        }
    })
    res.json(result)
}