import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Movie } from "./movie.entity";
import { User } from "./user.entity";

@Entity("movie_votes")
export class MovieVote {
  @PrimaryColumn()
  movie_id: string;

  @PrimaryColumn()
  user_id: string;

  @ManyToOne(() => User, (g) => g.movie_votes)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Movie, (m) => m.movie_votes)
  @JoinColumn({ name: "movie_id" })
  movie: Movie;
}
