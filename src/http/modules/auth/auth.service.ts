import * as jwt from "jsonwebtoken";
import { prisma } from "../../../config/prisma.js";
import { comparePassword, hashPassword } from "../../../core/utils/hashing.js";
import { Role } from "../../../generated/prisma/enums.js";
import * as dotnev from "dotenv";

dotnev.config();

export const AuthService = {
  //register user

  async registerUser(username: string, password: string, type: Role) {
    const hash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        username: username,
        password: hash,
        role: type,
      },
    });

    return user.id;
  },

  // login user

  async loginUser(username: string, password: string) {
    const user = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });

    if (!user) {
      throw "User not found";
    }

    const result = await comparePassword(password, user.password);

    if (result) {
      const secret: string =
        user.role == Role.Admin
          ? process.env.ADMIN_JWT_SECRET!
          : process.env.USER_JWT_SECRET!;
      const token = jwt.sign(
        {
          id: user.id,
          type: user.role,
        },
        secret,
      );

      return token;
    } else {
      throw "Password Incorrect";
    }
  },
};
