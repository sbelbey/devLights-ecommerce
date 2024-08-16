import express, { Request, Response } from "express";
import ExpressAppCreator from "./config/createApp";
import MiddlewaresConfig from "./config/middlewares.config";
import apiRouter from "./routers";

const appCreator = new ExpressAppCreator();
const app: express.Application = appCreator.createExpressApp();

MiddlewaresConfig.config(app);

app.use("/api/v1", apiRouter);

export default app;
