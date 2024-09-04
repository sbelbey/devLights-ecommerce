// LIBRARIES
import { Router } from "express";
// ROUTERS
import userRouter from "../api/user/routes";
import productRouter from "../api/product/routes";
import categoryRouter from "../api/category/routes";
import cartRouter from "../api/cart/routes";
import ticketRouter from "../api/ticket/routes";

const apiRouter = Router();

apiRouter.use("/users", userRouter);
apiRouter.use("/products", productRouter);
apiRouter.use("/categories", categoryRouter);
apiRouter.use("/carts", cartRouter);
apiRouter.use("/tickets", ticketRouter);

export default apiRouter;
