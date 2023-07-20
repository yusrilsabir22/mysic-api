import { Request, Response } from "express";
import { getOne } from "../config/s3client";
import {config} from "dotenv"
import db from '../config/db'
import { Song } from "../entities/Song";
import { Lyrics } from "../entities/Lyrics";
config()

export const HookControllers = async (req: Request, res: Response) => {

    const content: {videoId: string, data: {
        id: number,
        seek: number,
        start: number,
        end: number,
        text: string,
        tokens: number[],
        temperature: number,
        avg_logprob: number,
        compression_ratio: number,
        no_speech_prob: number
    }[]} = req.body
    
    const audioURL = `${process.env.S3_ENDPOINT_URL}/${process.env.S3_BUCKET}/${content.videoId}`

    await db.manager.transaction(async (manager) => {
        try {
            const song = new Song()
            song.videoId = content.videoId
            song.url = audioURL
            const result = await manager.save(song)
            const lyrics = content.data.map((item) => {
                const lyric = new Lyrics()
                lyric.id = item.id
                lyric.start = item.start
                lyric.end = item.end
                lyric.text = item.text
                lyric.song = result
                return lyric
            })
            await manager.save(lyrics)
        } catch (error) {
            console.log(error)
        }
    })

    res.send("ok")
}