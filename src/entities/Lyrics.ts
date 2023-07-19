import {Entity, BaseEntity, PrimaryColumn, Column, ManyToOne} from "typeorm";
import { Song } from "./Song";


@Entity()
export class Lyrics {
    @PrimaryColumn()
    id: number

    @Column()
    text: string

    @Column()
    start: number

    @Column()
    end: number

    @ManyToOne(() => Song, (song) => song.lyrics, {cascade: true})
    song: Song
}