import { injectable, inject } from "inversify";
import { NextFunction, Request, Response } from "express";
import {
  controller,
  httpGet,
  httpPost,
  httpPut,
  next,
  request,
  response,
} from "inversify-express-utils";
import mongoose from "mongoose";
import { UserService } from "../services/user.service";
import { TYPES } from "../types/types";
import StatusCode from "../enum/statusCode";

@controller("/user")
export class UserController {
  constructor(@inject(TYPES.UserService) private userService: UserService) {}
  @httpPost("/register")
  public async registerUser(
    @request() req: Request,
    @response() res: Response,
    @next() next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const { username, email, password, role } = req.body;
      const user = await this.userService.register(
        username,
        email,
        password,
        role,
        session
      );
      await session.commitTransaction();
      await session.endSession();
      res.status(StatusCode.OK).send(user);
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }

  @httpPost("/login")
  public async loginUser(
    @request() req: Request,
    @response() res: Response,
    @next() next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const { username, password } = req.body;
      const user = await this.userService.login(username, password, session);
      await session.commitTransaction();
      await session.endSession();
      res
        .cookie("token", user, {

          httpOnly: true,
          secure: true,
          path: '/',
          sameSite: 'none',
          maxAge: 24 * 60 * 60 * 1000,
        })
        .status(200)
        .json(user);
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }
  @httpGet("/logout",TYPES.AuthMiddleware)
  public async logout(
    @request() req: Request,
    @response() res: Response,
    @next() next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      res
        .cookie("token", "", {
          httpOnly: true,
          secure: true,
          path:'/',
          sameSite: "lax",
          expires: new Date(0),
        })
        .status(StatusCode.OK)
        .json("logout Success");
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }

  @httpGet("/update", TYPES.AuthMiddleware)
  public async updateUser(
    @request() req: Request,
    @response() res: Response,
    @next() next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      await session.commitTransaction();
      await session.endSession();
        res.status(StatusCode.OK).json('abc');
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }
}
