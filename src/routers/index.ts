import { Router } from "express";
import userRouter from "../api/user/routes";
import productRouter from "../api/product/routes";

const apiRouter = Router();

apiRouter.use("/users", userRouter);
apiRouter.use("/products", productRouter);

export default apiRouter;
