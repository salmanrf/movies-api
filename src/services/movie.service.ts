import { AppDataSource } from "../database/data-source";
import { Movie, MovieVoteCountView } from "../models/entities/movie.entity";
import { DataSource, ILike, Repository } from "typeorm";
import { AppError } from "../common/utils/custom-error";
import { CreateMovieDto } from "../dtos/create-movie.dto";
import { FindMovieDto } from "../dtos/find-movie.dto";
import { GetPaginatedData, GetPagination } from "../common/utils/pagination.util";
import { CreateGenreDto } from "../dtos/create-genre.dto";
import { Genre } from "../models/entities/genre.entity";
import { Artist } from "../models/entities/artist.entity";
import { MovieArtist } from "../models/entities/movie-artist.entity";
import { MovieGenre } from "../models/entities/movie-genre.entity";
import { CreateArtistDto } from "../dtos/create-artist.dto";
import { UpdateMovieDto } from "../dtos/update-movie.dto";
import { MovieVote } from "../models/entities/movie-vote.entity";
import { User } from "../models/entities/user.entity";

export class MovieService {
  private readonly dataSource: DataSource;
  private readonly movieRepo: Repository<Movie>;
  private readonly genreRepo: Repository<Genre>;
  private readonly artistRepo: Repository<Artist>;
  private readonly movieArtistRepo: Repository<MovieArtist>;
  private readonly movieGenreRepo: Repository<MovieGenre>;
  private readonly movieVoteRepo: Repository<MovieVote>;

  constructor() {
    this.dataSource = AppDataSource;
    this.movieRepo = AppDataSource.getRepository(Movie);
    this.genreRepo = AppDataSource.getRepository(Genre);
    this.artistRepo = AppDataSource.getRepository(Artist);
    this.movieArtistRepo = AppDataSource.getRepository(MovieArtist);
    this.movieGenreRepo = AppDataSource.getRepository(MovieGenre);
    this.movieVoteRepo = AppDataSource.getRepository(MovieVote);
  }

  async createGenre(createDto: CreateGenreDto) {
    try {
      const { name } = createDto;

      const genre = await this.genreRepo.save({ name });

      return genre;
    } catch (error) {
      throw error;
    }
  }

  async createArtist(createDto: CreateArtistDto) {
    try {
      const { name } = createDto;

      const artist = await this.artistRepo.save({ name });

      return artist;
    } catch (error) {
      console.log("error", error);

      throw error;
    }
  }

  async voteMovie(user_id: string, movie_id: string) {
    try {
      const user = await this.dataSource.manager.findOne(User, {
        where: {
          user_id,
        },
      });

      const movie = await this.movieRepo.findOne({
        where: {
          movie_id,
        },
      });

      if (!movie) {
        throw new AppError("movie not found.", 404);
      }

      if (!user) {
        throw new AppError("invalid user.", 404);
      }

      let movieVote = await this.movieVoteRepo.findOne({
        where: {
          user_id,
          movie_id,
        },
      });

      if (movieVote) {
        await this.movieVoteRepo.delete({
          user_id,
          movie_id,
        });
      } else {
        movieVote = await this.movieVoteRepo.save({
          user_id,
          movie_id,
        });
      }

      return movieVote;
    } catch (error) {
      throw error;
    }
  }

  async create(createDto: CreateMovieDto): Promise<Movie> {
    try {
      const { title, duration, description, watch_url, artists, genres } = createDto;

      if (!(artists instanceof Array) || artists.length === 0) {
        throw new AppError("Artists must be an array of artist_id", 400);
      }

      if (!(genres instanceof Array) || genres.length === 0) {
        throw new AppError("Genres must be an array of genre_id", 400);
      }

      const movie = await this.movieRepo.save({
        title,
        duration,
        description,
        watch_url,
      });

      const movieArtists = await this.movieArtistRepo.save(
        artists.map((id) => ({
          movie_id: movie.movie_id,
          artist_id: id,
        }))
      );

      const movieGenres = await this.movieGenreRepo.save(
        genres.map((id) => ({
          movie_id: movie.movie_id,
          genre_id: id,
        }))
      );

      return movie;
    } catch (error) {
      throw error;
    }
  }

  async updateMovie(movie_id: string, updateDto: UpdateMovieDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      const { title, description, duration, watch_url, artists, genres } = updateDto;

      const movie = await this.movieRepo.findOne({
        where: { movie_id },
      });

      if (!movie_id) {
        throw new AppError("Movie not found.", 404);
      }

      if (title != null) {
        movie.title = title;
      }

      if (description != null) {
        movie.description = description;
      }

      if (duration != null) {
        movie.duration = duration;
      }

      if (watch_url != null) {
        movie.watch_url = watch_url;
      }

      if (artists instanceof Array) {
        await queryRunner.manager.delete(MovieArtist, {
          movie_id,
        });

        await queryRunner.manager.save(
          MovieArtist,
          artists.map((id) => ({ movie_id, artist_id: id }))
        );
      }

      if (genres instanceof Array) {
        await queryRunner.manager.delete(MovieArtist, {
          movie_id,
        });

        await queryRunner.manager.save(
          MovieGenre,
          genres.map((id) => ({ movie_id, genre_id: id }))
        );
      }

      await queryRunner.commitTransaction();

      return movie;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(movie_id: string) {
    try {
      const movieQb = this.movieRepo.createQueryBuilder("m");

      movieQb.leftJoinAndMapOne(
        "m.movie_vote_view",
        MovieVoteCountView,
        "mv",
        "mv.movie_id = m.movie_id"
      );

      movieQb.leftJoinAndSelect("m.movie_genres", "mg");
      movieQb.leftJoinAndSelect("mg.genre", "g");

      movieQb.where({ movie_id });

      const movie = await movieQb.getOne();

      return movie;
    } catch (error) {
      throw error;
    }
  }

  async findMany(findDto: FindMovieDto) {
    try {
      const { title, artists, description, page, limit: pageSize } = findDto;
      let { sort_field, sort_order } = findDto;

      const { limit, offset } = GetPagination(+page, +pageSize);

      const movieQb = this.movieRepo.createQueryBuilder("m");

      const fields = ["movie_id", "title", "created_at"];
      const orders = ["ASC", "DESC"];

      movieQb.leftJoinAndMapOne(
        "m.movie_vote_view",
        MovieVoteCountView,
        "mv",
        "mv.movie_id = m.movie_id"
      );

      movieQb.leftJoinAndSelect("m.movie_genres", "mg");
      movieQb.leftJoinAndSelect("mg.genre", "g");

      if (title) {
        movieQb.andWhere(
          {
            title: ILike("%:title%"),
          },
          { title }
        );
      }

      if (description) {
        movieQb.andWhere(
          {
            description: ILike("%:description%"),
          },
          { description }
        );
      }

      if (!fields.includes(sort_field)) {
        sort_field = "created_at";
      }

      if (!orders.includes(sort_order)) {
        sort_order = "DESC";
      }

      movieQb.take(limit);
      movieQb.skip(offset);

      movieQb.addOrderBy("m." + sort_field, sort_order);

      const results = await movieQb.getManyAndCount();

      const data = GetPaginatedData({
        limit,
        sort_field,
        sort_order,
        count: results[1],
        items: results[0],
        page: isNaN(+page) ? 1 : +page || 1,
      });

      return data;
    } catch (error) {
      throw error;
    }
  }

  async findManyGenres(findDto: FindMovieDto) {
    try {
      const { page, limit: pageSize } = findDto;
      let { sort_field, sort_order } = findDto;

      const { limit, offset } = GetPagination(+page, +pageSize);

      const genreQb = this.genreRepo.createQueryBuilder("g");

      const fields = ["genre_id", "name", "created_at"];
      const orders = ["ASC", "DESC"];

      if (!fields.includes(sort_field)) {
        sort_field = "created_at";
      }

      if (!orders.includes(sort_order)) {
        sort_order = "DESC";
      }

      genreQb.take(limit);
      genreQb.skip(offset);

      genreQb.addOrderBy(sort_field, sort_order);

      const results = await genreQb.getManyAndCount();

      const data = GetPaginatedData({
        limit,
        sort_field,
        sort_order,
        count: results[1],
        items: results[0],
        page: isNaN(+page) ? 1 : +page || 1,
      });

      return data;
    } catch (error) {
      throw error;
    }
  }

  async findManyArtists(findDto: FindMovieDto) {
    try {
      const { page, limit: pageSize } = findDto;
      let { sort_field, sort_order } = findDto;

      const { limit, offset } = GetPagination(+page, +pageSize);

      const artistQb = this.artistRepo.createQueryBuilder("a");

      const fields = ["artist_id", "title", "created_at"];
      const orders = ["ASC", "DESC"];

      if (!fields.includes(sort_field)) {
        sort_field = "created_at";
      }

      if (!orders.includes(sort_order)) {
        sort_order = "DESC";
      }

      artistQb.take(limit);
      artistQb.skip(offset);

      artistQb.addOrderBy(sort_field, sort_order);

      const results = await artistQb.getManyAndCount();

      const data = GetPaginatedData({
        limit,
        sort_field,
        sort_order,
        count: results[1],
        items: results[0],
        page: isNaN(+page) ? 1 : +page || 1,
      });

      return data;
    } catch (error) {
      throw error;
    }
  }
}
