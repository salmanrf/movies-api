import { DataSource } from "typeorm";
import * as dataSource from "../../src/database/data-source";
import { CreateMovieDto } from "../../src/dtos/create-movie.dto";
import { UpdateMovieDto } from "../../src/dtos/update-movie.dto";
import { User } from "../../src/models/entities/user.entity";
import { MovieService } from "../../src/services/movie.service";

const dataSourceMock = dataSource;

jest.mock("../../src/database/data-source", () => ({
  AppDataSource: {
    getRepository: jest.fn(),
    manager: {
      findOne: jest.fn(),
    },
    createQueryRunner: jest.fn(() => ({
      startTransaction: jest.fn(),
      manager: {
        findOne: jest.fn(),
        save: jest.fn(),
        delete: jest.fn(),
      },
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
    })),
  },
}));

describe("Movie Service", () => {
  let movieService: MovieService;

  beforeAll(() => {
    movieService = new MovieService();
  });

  describe("Genre", () => {
    beforeAll(() => {
      (movieService as any)["genreRepo"] = {
        save: jest.fn((entity: any) => {
          if (!entity) {
            throw new Error("invalid entity");
          }

          if (entity.name == null) {
            throw new Error("name can't empty");
          }

          return { genre_id: "123", ...entity };
        }),
      };
    });

    describe("Create Genre", () => {
      test("It should create genre with specified value", async () => {
        const dto = {
          name: "Crime",
        };

        const result = await movieService.createGenre(dto);

        expect(result.genre_id).toBeDefined();
        expect(result.name).toBe(dto.name);
      });

      test("It should fail when dto is not passed", () => {
        expect(movieService.createGenre).rejects.toThrow();
      });

      test("It should fail when dto.name is not specified", () => {
        expect(() => movieService.createGenre({ name: null } as any)).rejects.toThrow();
      });
    });
  });

  describe("Artist", () => {
    beforeAll(() => {
      (movieService as any)["artistRepo"] = {
        save: jest.fn((entity: any) => {
          if (!entity) {
            throw new Error("invalid entity");
          }

          if (entity.name == null) {
            throw new Error("name can't empty");
          }

          return { artist_id: "123", ...entity };
        }),
      };
    });

    describe("Create Artist", () => {
      test("It should create artist with specified value", async () => {
        const dto = {
          name: "Robert De Niro",
        };

        const result = await movieService.createArtist(dto);

        expect(result.artist_id).toBeDefined();
        expect(result.name).toBe(dto.name);
      });

      test("It should fail when dto is not passed", () => {
        expect(() => movieService.createArtist(undefined as any)).rejects.toThrow();
      });

      test("It should fail when dto.name is null", () => {
        expect(() => movieService.createArtist({ name: null } as any)).rejects.toThrow();
      });
    });
  });

  describe("Movie", () => {
    const userMock = {
      user_id: "890",
      email: "salmanrf2@gmail.com",
      password: "Salman RF",
      created_at: new Date(),
      updated_at: null,
      movie_votes: [],
    };

    const movieMock = {
      movie_id: "456",
      vote_count: 0,
      title: "Goodfellas (1990)",
      duration: 146,
      watch_url: "https://www.imdb.com/title/tt0099685/",
      description: "Lorem Ipsum",
      created_at: new Date(),
      updated_at: null,
    };

    beforeAll(() => {
      // ? Mock manager findOne for User
      jest.spyOn(dataSourceMock.AppDataSource.manager, "findOne").mockResolvedValue(userMock);

      movieService = new MovieService();

      (movieService as any)["movieRepo"] = {
        save: jest.fn(),
        findOne: jest.fn(() => movieMock),
        delete: jest.fn(),
      };
      (movieService as any)["movieVoteRepo"] = {
        save: jest.fn((entity) => Promise.resolve({ ...entity })),
        findOne: jest.fn(() => null),
        delete: jest.fn().mockResolvedValue(null),
      };
      (movieService as any)["movieArtistRepo"] = {
        save: jest.fn(),
        findOne: jest.fn(),
        delete: jest.fn().mockResolvedValue(null),
      };
      (movieService as any)["movieGenreRepo"] = {
        save: jest.fn(),
        findOne: jest.fn(),
        delete: jest.fn().mockResolvedValue(null),
      };
    });

    describe("Vote Movie", () => {
      test("Should successfully create new movie vote", async () => {
        const userId = "890";
        const movieId = "456";
        const movieVote = await movieService.voteMovie(userId, movieId);

        expect(movieVote.user_id).toBe(userId);
        expect(movieVote.movie_id).toBe(movieId);
      });

      test("Should fail if user or movie is not found", async () => {
        (dataSourceMock.AppDataSource.manager.findOne as any).mockResolvedValueOnce(null);

        expect(() => movieService.voteMovie("111", "456")).rejects.toThrow();
      });

      test("Should fail if movie is not found", async () => {
        (movieService["movieRepo"].findOne as any).mockResolvedValueOnce(null);

        expect(() => movieService.voteMovie("111", "456")).rejects.toThrow();
      });

      test("Should delete existing vote if user has already voted", async () => {
        const movieVoteMock = {
          user_id: "asd",
          movie_id: "dsa",
        };

        (movieService["movieVoteRepo"].findOne as any).mockResolvedValueOnce(movieVoteMock);

        const res = await movieService.voteMovie(movieVoteMock.user_id, movieVoteMock.movie_id);

        expect(movieService["movieVoteRepo"].delete).toHaveBeenCalled();
        expect(res).toBe(movieVoteMock);
      });
    });

    describe("Create Movie", () => {
      beforeAll(() => {
        (movieService["movieRepo"] as any).save.mockImplementation((entitiy: any) => {
          if (!entitiy) {
            throw new Error("invalid entity");
          }

          const fields = ["title", "duration", "description", "watch_url"];

          if (fields.some((f) => entitiy[f] === null)) {
            throw new Error("not null constraint");
          }

          return { movie_id: "123", ...entitiy };
        });
      });

      test("Should successfully create new movie", async () => {
        const movieDto: CreateMovieDto = {
          ...movieMock,
          artists: [1, 2],
          genres: [3, 4],
        };

        const res = await movieService.create(movieDto);

        expect(res.movie_id).toBeDefined();
      });

      test("Should fail if artists is null or empty array", async () => {
        const movieDto: CreateMovieDto = {
          ...movieMock,
          artists: [],
          genres: [3, 4],
        };

        expect(() => movieService.create(movieDto)).rejects.toThrow();
      });

      test("Should fail if genres is null or empty array", async () => {
        const movieDto: CreateMovieDto = {
          ...movieMock,
          artists: [1, 3],
          genres: [],
        };

        expect(() => movieService.create(movieDto)).rejects.toThrow();
      });

      test("Should fail if required any of fields are empty 1/4", async () => {
        const movieDto: CreateMovieDto = {
          ...movieMock,
          watch_url: null,
          artists: [1, 3],
          genres: [3, 4],
        } as any as CreateMovieDto;

        expect(() => movieService.create(movieDto)).rejects.toThrow();
      });

      test("Should fail if required any of fields are empty 2/4", async () => {
        const movieDto: CreateMovieDto = {
          ...movieMock,
          title: null,
          artists: [1, 3],
          genres: [3, 4],
        } as any as CreateMovieDto;

        expect(() => movieService.create(movieDto)).rejects.toThrow();
      });

      test("Should fail if required any of fields are empty 3/4", async () => {
        const movieDto: CreateMovieDto = {
          ...movieMock,
          description: null,
          artists: [1, 3],
          genres: [3, 4],
        } as any as CreateMovieDto;

        expect(() => movieService.create(movieDto)).rejects.toThrow();
      });

      test("Should fail if required any of fields are empty 4/4", async () => {
        const movieDto: CreateMovieDto = {
          ...movieMock,
          duration: null,
          artists: [1, 3],
          genres: [3, 4],
        } as any as CreateMovieDto;

        expect(() => movieService.create(movieDto)).rejects.toThrow();
      });
    });

    describe("Update Movie", () => {
      test("Should successfully update existing movie", async () => {
        const movieDto = {
          ...movieMock,
          title: "GoodPallas",
          duration: 120,
          watch_url: null,
        } as any as UpdateMovieDto;

        const res = await movieService.updateMovie("123", movieDto);

        expect(res.title).toBe(movieDto.title);
        expect(res.duration).toBe(movieDto.duration);
        expect(res.watch_url).toBe(movieMock.watch_url);
      });

      test("Should fail if movie is not found", () => {
        // @ts-ignore
        movieService["movieRepo"].findOne.mockResolvedValueOnce(null);

        expect(() => movieService.updateMovie("321", movieMock)).rejects.toThrow(/not found/i);
      });

      // test("Should delete and update artists if provided", async () => {
      //   const movieDto = {
      //     ...movieMock,
      //     artists: [8, 9],
      //   };

      //   const res = await movieService.updateMovie("456", movieDto);

      //   expect(dataSourceMock.AppDataSource.createQueryRunner)
      // });
    });
  });
});
