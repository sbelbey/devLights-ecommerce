import { Router } from "express";
import userRouter from "../api/user/routes";

const apiRouter = Router();

apiRouter.use("/users", userRouter);

export default apiRouter;
