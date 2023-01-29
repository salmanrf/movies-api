import { NextFunction, Request, Response, Router } from "express";
import { CreateArtistSchema } from "../dtos/create-artist.dto";
import { CreateGenreSchema } from "../dtos/create-genre.dto";
import { CreateMovieSchema } from "../dtos/create-movie.dto";
import { UpdateMovieSchema } from "../dtos/update-movie.dto";
import { Validate } from "../dtos/validate";
import { AuthorizeAdmin, AuthorizeUser } from "../middlewares/authorization";
import { MovieService } from "../services/movie.service";

export class MovieController {
  private router: Router;
  private movieService: MovieService;

  constructor() {
    this.router = Router();
    this.movieService = new MovieService();

    this.setupRoutes();
  }

  getRouter(): Router {
    return this.router;
  }

  private setupRoutes() {
    this.router.post("/genres", AuthorizeAdmin, Validate(CreateGenreSchema), this.createGenre);
    this.router.post("/artists", AuthorizeAdmin, Validate(CreateArtistSchema), this.createArtist);
    this.router.post("/", AuthorizeAdmin, Validate(CreateMovieSchema), this.create);

    this.router.get("/genres", this.findGenres);
    this.router.get("/artists", this.findArtists);
    this.router.get("/:movie_id", this.findOneMovie);
    this.router.get("/", this.findMovies);

    this.router.put("/:movie_id", AuthorizeAdmin, Validate(UpdateMovieSchema), this.update);

    this.router.patch("/:movie_id/vote", AuthorizeUser, this.voteMovie);
  }

  private voteMovie = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { movie_id } = req.params;

      const result = await this.movieService.voteMovie(req["decoded"]["user_id"], movie_id);

      return res.status(201).json({
        status: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  private create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req;

      const result = await this.movieService.create(body);

      return res.status(201).json({
        status: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  private update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { movie_id } = req.params;
      const { body } = req;

      const result = await this.movieService.updateMovie(movie_id, body);

      return res.status(200).json({
        status: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  private createGenre = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req;

      const result = await this.movieService.createGenre(body);

      return res.status(201).json({
        status: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  private createArtist = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req;

      const result = await this.movieService.createArtist(body);

      return res.status(201).json({
        status: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  private findOneMovie = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { movie_id } = req.params;

      const result = await this.movieService.findOne(movie_id);

      return res.status(200).json({
        status: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  private findMovies = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { query } = req;

      const result = await this.movieService.findMany(query as any);

      return res.status(200).json({
        status: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  private findGenres = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { query } = req;

      const result = await this.movieService.findManyGenres(query as any);

      return res.status(200).json({
        status: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  private findArtists = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { query } = req;

      const result = await this.movieService.findManyArtists(query as any);

      return res.status(200).json({
        status: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
