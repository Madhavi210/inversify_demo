import { User } from "../model/user.model";
import { inject, injectable } from "inversify";
import IUser from "../interface/user.interface";
import { ClientSession } from "mongoose";
import AppError from "../utils/appError";
import StatusConstants from "../constant/status.constant";
import bcrypt from "bcrypt";
import { config } from "../config/config";
import { userRole } from "../enum/role";
import { generateToken } from "../utils/token";
import Role from "../model/role.model";
@injectable()
export class UserService {
  constructor() {}
  async register(
    username: string,
    email: string,
    password: string,
    role: string,
    session: ClientSession
  ): Promise<IUser> {
    const exist = await User.findOne({ email: email }).session(session);
    if (exist) {
      throw new AppError(
        StatusConstants.RESOURCE_ALREADY_EXISTS.body.message,
        StatusConstants.RESOURCE_ALREADY_EXISTS.httpStatusCode
      );
    }
    const assignedRole = await Role.findOne({ name: role }).session(session);
    if (!assignedRole) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username: username,
      email: email,
      password: hashedPassword,
      role: assignedRole._id,
    });
    await newUser.save();
    return newUser;
  }

  async login(
    username: string,
    password: string,
    session: ClientSession
  ): Promise<string> {
    const exist = await User.findOne({ username: username }).session(session);
    if (!exist) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    const decryptPassword = await bcrypt.compare(password, exist.password);
    if (!decryptPassword) {
      throw new AppError(
        StatusConstants.UNAUTHORIZED.body.message,
        StatusConstants.UNAUTHORIZED.httpStatusCode
      );
    }
    if (!config.secret_key) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    const token = generateToken(
      exist._id,
      exist.username,
      exist.email,
      exist.role
    );
    exist.token = token;
    await exist.save();
    return exist.token;
  }
}
