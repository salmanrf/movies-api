import { AppDataSource } from "../database/data-source";
import { Post } from "../models/entities/post.entity";
import { DataSource, Repository } from "typeorm";

export class PostService {
  private postRepository: Repository<Post>;

  constructor() {
    this.postRepository = AppDataSource.getRepository(Post);
  }

  async findMany() {
    return this.postRepository.find();
  }

  findOne() {
    return "a post";
  }

  create() {
    return "post created";
  }

  update() {
    return "post updated";
  }

  delete() {
    return "post deleted";
  }
}
