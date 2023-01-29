import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Genre } from "./genre.entity";
import { Movie } from "./movie.entity";

@Entity("movie_genres")
export class MovieGenre {
  @PrimaryColumn({ type: "uuid" })
  movie_id: string;

  @PrimaryColumn({ type: "int" })
  genre_id: number;

  @ManyToOne(() => Genre, (g) => g.movie_genres)
  @JoinColumn({ name: "genre_id" })
  genre: Genre;

  @ManyToOne(() => Movie, (m) => m.movie_genres)
  @JoinColumn({ name: "movie_id" })
  movie: Movie;
}
