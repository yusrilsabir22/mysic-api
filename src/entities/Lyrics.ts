import {Entity, BaseEntity, PrimaryColumn, Column, ManyToOne} from "typeorm";
import { Song } from "./Song";


class ColumnNumericTransformer {
  to(data: number): number {
    return data;
  }
  from(data: string): number {
    return parseFloat(data);
  }
}

@Entity()
export class Lyrics {
    @PrimaryColumn()
    id: number

    @Column()
    text: string

    @Column({type: "decimal", precision: 6, scale: 2, default: 0.0, transformer: new ColumnNumericTransformer()})
    start: number

    @Column({type: "decimal", precision: 6, scale: 2, default: 0.0, transformer: new ColumnNumericTransformer()})
    end: number

    @ManyToOne(() => Song, (song) => song.lyrics, {cascade: true})
    song: Song
}