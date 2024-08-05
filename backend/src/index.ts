import "reflect-metadata";
import express from "express";
import { InversifyExpressServer } from "inversify-express-utils";
import { config } from "./config/config";
import { DatabaseService } from "./db/db";
import container from "./config/inversify.config";
import { TYPES } from "./types/types";
import cors from "cors";
import errorHandlerMiddleware from "./handler/error.handler";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
const dbService = container.get<DatabaseService>(TYPES.DataBaseService);
dbService.connect();

const server = new InversifyExpressServer(container, null, {
    rootPath: "/api",
  });

server
  .setConfig((app) => {
    app.use(cors({
      credentials: true,
      origin: ["http://localhost:4200"]
    }));
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(express.json());

  })
  .setErrorConfig((app) => {
    app.use(errorHandlerMiddleware);
  });
const appConfig = server.build();

appConfig.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
