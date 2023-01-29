import {
  AfterLoad,
  Column,
  CreateDateColumn,
  DataSource,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ViewColumn,
  ViewEntity,
} from "typeorm";
import { MovieGenre } from "./movie-genre.entity";
import { MovieVote } from "./movie-vote.entity";

@ViewEntity({
  name: "movie_vote_count_view",
  expression: (ds: DataSource) =>
    ds
      .createQueryBuilder()
      .from(MovieVote, "mv")
      .select("COUNT(movie_id)::INTEGER vote_count")
      .addSelect("mv.movie_id movie_id")
      .groupBy("mv.movie_id"),
})
export class MovieVoteCountView {
  @ViewColumn()
  movie_id: string;

  @ViewColumn()
  vote_count: number;
}

@Entity("movies")
export class Movie {
  @AfterLoad()
  getVoteCount() {
    if (!this.movie_vote_view) {
      this.movie_vote_view = {
        movie_id: this.movie_id,
        vote_count: 0,
      };
    }

    this.vote = this.movie_vote_view.vote_count;

    delete this.movie_vote_view;
  }

  @PrimaryGeneratedColumn("uuid")
  movie_id: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  title: string;

  @Column({ type: "text", nullable: false })
  description: string;

  @Column({ type: "int", nullable: false })
  duration: number;

  @Column({ type: "varchar", length: 255, nullable: false })
  watch_url: string;

  @CreateDateColumn()
  created_at: Date | string;

  @UpdateDateColumn()
  updated_at: Date | string;

  @OneToMany(() => MovieGenre, (mg) => mg.movie)
  movie_genres: MovieGenre[];

  @OneToMany(() => MovieVote, (mv) => mv.movie)
  movie_votes: MovieVote[];

  movie_vote_view: MovieVoteCountView;

  vote: number;
}
