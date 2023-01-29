import * as bcrypt from "bcrypt";
import { AppDataSource } from "../database/data-source";
import { Admin } from "../models/entities/admin.entity";
import { Repository } from "typeorm";
import { CreateAdminDto } from "../dtos/create-admin.dto";
import { AdminLoginDto } from "../dtos/admin-login.dto";
import { AppError } from "../common/utils/custom-error";
import { JwtSign } from "../common/utils/jwt-utils";

export class AdminService {
  private readonly adminRepo: Repository<Admin>;

  constructor() {
    this.adminRepo = AppDataSource.getRepository(Admin);
  }

  async create(createDto: CreateAdminDto): Promise<Omit<Admin, "password">> {
    try {
      const { email, name, password } = createDto;

      const hash = await bcrypt.hash(password, 10);

      const newAdmin = await this.adminRepo.save({
        email,
        name,
        password: hash,
      });

      const { password: pwd, ...admin } = newAdmin;

      return admin;
    } catch (error) {
      throw error;
    }
  }

  async login(loginDto: AdminLoginDto): Promise<string> {
    try {
      const { email, password } = loginDto;

      const admin = await this.adminRepo.findOne({
        where: {
          email: email.trim(),
        },
      });

      if (!admin) {
        throw new AppError("Invalid email/password.", 400);
      }

      const passwordMatch = await bcrypt.compare(password, admin.password);

      if (!passwordMatch) {
        throw new AppError("Invalid email/password.", 400);
      }

      const token = await JwtSign(
        {
          role: "admin",
          email: admin.email,
          name: admin.name,
        },
        process.env.ADMIN_JWT_SECRET
      );

      return token;
    } catch (error) {
      throw error;
    }
  }
}
