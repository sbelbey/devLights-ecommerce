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

/**
 * Retrieves a product.
 */
productRouter.get(
    "/",
    schemaValidator(null, idValidator),
    ProductController.getProduct
);

/**
 * Creates a new product.
 */
productRouter.post(
    "/",
    uploadFields,
    checkUserRole([UserRole.ADMIN, UserRole.SALER]),
    schemaValidator(productCreatePayloadValidator, null),
    ProductController.createProduct
);

/**
 * Updates an existing product.
 *
 * @param id - The ID of the product to update.
 * @param body - The updated product data.∫
 */
productRouter.put(
    "/:id",
    uploadFields,
    checkUserRole([UserRole.SALER]),
    schemaValidator(productUpdatePayloadValidator, idValidator),
    ProductController.updateProduct
);

/**
 * Deletes an existing product.∫
 *
 * @param id - The ID of the product to delete.
 */
productRouter.delete(
    "/:id",
    checkUserRole([UserRole.ADMIN, UserRole.SALER]),
    schemaValidator(null, idValidator),
    ProductController.deleteProduct
);

export default productRouter;
