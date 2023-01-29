import * as bcrypt from "bcrypt";
import { AppDataSource } from "../database/data-source";
import { User } from "../models/entities/user.entity";
import { Repository } from "typeorm";
import { CreateAdminDto } from "../dtos/create-admin.dto";
import { AdminLoginDto } from "../dtos/admin-login.dto";
import { AppError } from "../common/utils/custom-error";
import { JwtSign } from "../common/utils/jwt-utils";

export class UserService {
  private readonly userRepo: Repository<User>;

  constructor() {
    this.userRepo = AppDataSource.getRepository(User);
  }

  async register(createDto: CreateAdminDto): Promise<Omit<User, "password">> {
    try {
      const { email, name, password } = createDto;

      const hash = await bcrypt.hash(password, 10);

      const newUser = await this.userRepo.save({
        email,
        name,
        password: hash,
      });

      const { password: pwd, ...user } = newUser;

      return user;
    } catch (error) {
      throw error;
    }
  }

  async login(loginDto: AdminLoginDto): Promise<string> {
    try {
      const { email, password } = loginDto;

      const user = await this.userRepo.findOne({
        where: {
          email: email.trim(),
        },
      });

      if (!user) {
        throw new AppError("Invalid email/password.", 400);
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        throw new AppError("Invalid email/password.", 400);
      }

      const token = await JwtSign(
        {
          role: "user",
          user_id: user.user_id,
          email: user.email,
          name: user.name,
        },
        "silversoul"
      );

      return token;
    } catch (error) {
      throw error;
    }
  }
}
