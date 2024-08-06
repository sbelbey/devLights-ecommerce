import express, { Request, Response } from "express";
import ExpressAppCreator from "./config/createApp";
import MiddlewaresConfig from "./config/middlewares.config";
import ApiRouter from "./routers/api.router";

const appCreator = new ExpressAppCreator();
const app: express.Application = appCreator.createExpressApp();

MiddlewaresConfig.config(app);

const apiRouter = new ApiRouter().getRouter();

app.use("/api/v1", apiRouter);

export default app;
