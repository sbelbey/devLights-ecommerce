import { Router } from "express";
import { idValidator } from "../../middlewares/validators/common.validator";
import schemaValidator from "../../middlewares/schemaValidators.middlewares";
import ProductController from "./controller";
import { productCreatePayloadValidator } from "./validator";
import checkUserRole from "../../middlewares/roleChecker.middlewares";
import { UserRole } from "../../constants/UserRole.constants";

const productRouter = Router();

productRouter.get(
    "/",
    checkUserRole([UserRole.ADMIN, UserRole.SALER]),
    schemaValidator(null, idValidator),
    ProductController.getProduct
);

productRouter.post(
    "/",
    schemaValidator(productCreatePayloadValidator, null),
    ProductController.createProduct
);

export default productRouter;
