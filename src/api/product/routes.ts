// LIBRARIES
import { Router } from "express";
// MIDDLEWARES
import { idValidator } from "../../middlewares/validators/common.validator";
import schemaValidator from "../../middlewares/schemaValidators.middlewares";
import checkUserRole from "../../middlewares/roleChecker.middlewares";
import { uploadFields } from "../../middlewares/uploadFields.middlewares";
// VALIDATORS
import {
    productCreatePayloadValidator,
    productUpdatePayloadValidator,
} from "./validator";
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
    uploadFields,
    checkUserRole([UserRole.ADMIN, UserRole.SALER]),
    schemaValidator(productCreatePayloadValidator, null),
    ProductController.createProduct
);

productRouter.put(
    "/:id",
    uploadFields,
    checkUserRole([UserRole.SALER]),
    schemaValidator(productUpdatePayloadValidator, idValidator),
    ProductController.updateProduct
);

productRouter.delete(
    "/:id",
    checkUserRole([UserRole.ADMIN, UserRole.SALER]),
    schemaValidator(null, idValidator),
    ProductController.deleteProduct
);

export default productRouter;
