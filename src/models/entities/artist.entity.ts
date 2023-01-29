import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("artists")
export class Artist {
  @PrimaryGeneratedColumn("increment")
  artist_id: number;

  @Column({ type: "varchar", length: 255, nullable: false })
  name: string;

  @CreateDateColumn()
  created_at: Date | string;

  @UpdateDateColumn()
  updated_at: Date | string;
}
