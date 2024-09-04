// LIBRARIES
import { Router } from "express";
// MIDDLEWARES
import { idValidator } from "../../middlewares/validators/common.validator";
import schemaValidator from "../../middlewares/schemaValidators.middlewares";
import checkUserRole from "../../middlewares/roleChecker.middlewares";
// VALIDATORS
import { productCreatePayloadValidator } from "./validator";
// CONTROLLERS
import ProductController from "./controller";
// CONSTANTS
import { UserRole } from "../../constants/UserRole.constants";

const productRouter = Router();

productRouter.get(
    "/",
    schemaValidator(null, idValidator),
    ProductController.getProduct
);

productRouter.post(
    "/",
    checkUserRole([UserRole.ADMIN, UserRole.SALER]),
    schemaValidator(productCreatePayloadValidator, null),
    ProductController.createProduct
);

export default productRouter;
