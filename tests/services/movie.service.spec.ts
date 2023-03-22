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
});
