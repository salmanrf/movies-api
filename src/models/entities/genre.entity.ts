import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { MovieGenre } from "./movie-genre.entity";

@Entity("genres")
export class Genre {
  @PrimaryGeneratedColumn("increment")
  genre_id: number;

  @Column({ type: "varchar", length: 255, nullable: false })
  name: string;

  @CreateDateColumn()
  created_at: Date | string;

  @UpdateDateColumn()
  updated_at: Date | string;

  @OneToMany(() => MovieGenre, (mg) => mg.genre)
  movie_genres: MovieGenre[];
}
