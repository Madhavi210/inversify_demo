import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { config } from "../config/config";
import StatusConstants from "../constant/status.constant";
import AppError from "./appError";
export const generateToken = (
  id: Types.ObjectId,
  username: string,
  email: string,
  role: Types.ObjectId
) => {
  if (!config.secret_key) {
    throw new AppError(
      StatusConstants.NOT_FOUND.body.message,
      StatusConstants.NOT_FOUND.httpStatusCode
    );
  }
  return jwt.sign(
    { id: id, username: username, email: email, role: role },
    config.secret_key,
    { expiresIn: "10h" }
  );
};
