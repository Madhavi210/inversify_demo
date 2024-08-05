import { Types } from "mongoose";

declare module "express" {
  interface Request {
    id?: Types.ObjectId;
    username?: string;
    email?: string;
    role?: Types.ObjectId;
  }
}
