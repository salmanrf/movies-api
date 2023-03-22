import { DataSource } from "typeorm";
import * as dataSource from "../../src/database/data-source";
import { User } from "../../src/models/entities/user.entity";
import { MovieService } from "../../src/services/movie.service";

const dataSourceMock = dataSource;

jest.mock("../../src/database/data-source", () => ({
  AppDataSource: {
    getRepository: jest.fn(),
    manager: {
      findOne: jest.fn(),
    },
  },
}));

describe("Movie Service", () => {
  let movieService: MovieService;

  beforeAll(() => {
    movieService = new MovieService();
  });

  describe("Create Genre", () => {
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

  describe("Create Artist", () => {
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

  describe("Vote Movie", () => {
    beforeAll(() => {
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
        created_at: new Date(),
        updated_at: null,
      };

      // ? Mock manager findOne for User
      jest.spyOn(dataSourceMock.AppDataSource.manager, "findOne").mockResolvedValue(userMock);

      movieService = new MovieService();

      (movieService as any)["movieRepo"] = {
        findOne: jest.fn(),
      };
      (movieService as any)["movieVoteRepo"] = {
        delete: jest.fn().mockResolvedValue(null),
        findOne: jest.fn(),
        save: jest.fn(),
      };

      jest.spyOn(movieService["movieRepo"], "findOne").mockResolvedValue(movieMock as any);
      jest.spyOn(movieService["movieVoteRepo"], "findOne").mockResolvedValue(null);
      jest
        .spyOn(movieService["movieVoteRepo"], "save")
        .mockImplementation((entity) => Promise.resolve({ ...entity }) as any);
    });

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
});
