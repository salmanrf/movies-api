import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { MovieVote } from "./movie-vote.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  user_id: string;

  @Column({ type: "varchar", length: 255, nullable: false, unique: true })
  email: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  password: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  name: string;

  @CreateDateColumn()
  created_at: Date | string;

  @UpdateDateColumn()
  updated_at: Date | string;

  @OneToMany(() => MovieVote, (mv) => mv.user)
  movie_votes: MovieVote[];
}
