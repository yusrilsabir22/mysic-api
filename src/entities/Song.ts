import {Entity, BaseEntity, PrimaryColumn, Column, OneToMany} from "typeorm";
import { Lyrics } from "./Lyrics";


@Entity()
export class Song {
    
    @PrimaryColumn()
    videoId: string

    @Column()
    url: string

    @OneToMany(() => Lyrics, (lyric) => lyric.song)
    lyrics: Lyrics[]
}