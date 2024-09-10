// LIBRARIES
import { Router } from "express";
// ROUTERS
import userRouter from "../api/user/routes";
import productRouter from "../api/product/routes";
import categoryRouter from "../api/category/routes";
import cartRouter from "../api/cart/routes";
import ticketRouter from "../api/ticket/routes";

const apiRouter = Router();

/**
 * Mounts the user router at the "/users" path on the API router.
 */
apiRouter.use("/users", userRouter);
/**
 * Mounts the product router at the "/products" path on the API router.
 */
apiRouter.use("/products", productRouter);
/**
 * Mounts the category router at the "/categories" path on the API router.
 */
apiRouter.use("/categories", categoryRouter);
/**
 * Mounts the cart router at the "/carts" path on the API router.
 */
apiRouter.use("/carts", cartRouter);
/**
 * Mounts the ticket router at the "/tickets" path on the API router.
 */
apiRouter.use("/tickets", ticketRouter);

export default apiRouter;
