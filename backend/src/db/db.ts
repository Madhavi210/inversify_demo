import { injectable } from "inversify";
import mongoose from "mongoose";
import { config } from "../config/config";
import AppError from "../utils/appError";
import StatusConstants from "../constant/status.constant";

@injectable()
export default class DatabaseService {
    private dbURL: string;
  constructor() {
    if (!config.mongo_url) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    this.dbURL = config.mongo_url;
  }

  public async connect(): Promise<void> {
    try {
      await mongoose.connect(this.dbURL);
      console.log("Connected to MongoDB");
    } catch (error) {
      throw new AppError(
        StatusConstants.CONFLICT.body.message,
        StatusConstants.CONFLICT.httpStatusCode
      );
    }
  }
}