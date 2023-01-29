import { Entity, PrimaryColumn } from "typeorm";

@Entity("movie_artists")
export class MovieArtist {
  @PrimaryColumn()
  movie_id: string;

  @PrimaryColumn()
  artist_id: number;
}
