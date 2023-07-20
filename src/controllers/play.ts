import { Request, Response } from "express";
import ytdl from "ytdl-core";
import FfmpegCommand from "fluent-ffmpeg"
import {upload} from "../config/s3client"
import { PassThrough } from "stream";
import {config} from "dotenv"
config()

export const PlayController = async (req: Request, res: Response) => {

    const id = (req.params.id as string).replace(".mp3", "")
    const info = await ytdl.getInfo(id)
    const audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' })

    let range = req.headers.range;

    let positions = ["0", audioFormat.contentLength] 

    if (range) {
        positions = range.replace(/bytes=/, "").split("-");
    }
    let start = parseInt(positions[0], 10);
    let total = parseInt(audioFormat.contentLength)
    let end = positions[1] ? parseInt(positions[1], 10) : total - 1;
    let chunksize = (end - start) + 1;

    res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Transfer-Encoding': 'chunked',
        "Content-Range": "bytes " + start + "-" + end + "/" + total,
        'Content-Type': 'audio/mp3',
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize
    });
    
    const f1 = FfmpegCommand(audioFormat.url)
        .toFormat("mp3")
        .format("mp3")
    const streamResponse = new PassThrough()
    const streamUpload = new PassThrough()
    const ff = f1.pipe()
    
    ff.on("data", (chunk) => {
        streamResponse.write(chunk)
        streamUpload.write(chunk)
    })

    ff.on("error", (_) => {})

    ff.on("end", () => {
        upload(streamUpload, id+".mp3", chunksize)
            .then(() => {
                try {
                    const audioURL = `${process.env.S3_ENDPOINT_URL}/${process.env.S3_BUCKET}/${id}.mp3`
                    fetch(`${process.env.AUDIO_JAX_WHISPER_URL!}/transcribe?audio_url=${audioURL}&language=id&cb_url=http://localhost:3000/api/v1/hook`)
                    .catch(_ => {})
                } catch (error) {}
                
            })
            .catch(console.log)
    })

    ff.on("close", () => {})

    streamUpload.on("error", (_) => {})

    streamResponse.pipe(res, {end: true})
        .on("error", (_) => {})
        .on("close", () => {
            ff.emit("end")
        })
}