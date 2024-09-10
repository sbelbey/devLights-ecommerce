// LIBRARIES
import { Router } from "express";
// MIDDLEWARES
import schemaValidator from "../../middlewares/schemaValidators.middlewares";
import { idValidatorRequired } from "../../middlewares/validators/common.validator";
import checkUserRole from "../../middlewares/roleChecker.middlewares";
// CONSTROLLERS
import CartController from "./controller";
// CONSTANTS
import { UserRole } from "../../constants/UserRole.constants";

const cartRouter = Router();

/**
 * Adds a product to the user's cart.
 *
 * @param {string} id - The ID of the user.
 * @param {string} productId - The ID of the product to add to the cart.
 */
cartRouter.post(
    "/:id/product/:productId",
    schemaValidator(null, idValidatorRequired),
    checkUserRole([UserRole.USER]),
    CartController.addToCart
);

/**
 * Allows a user to purchase the items in their cart.
 *
 * @param {string} id - The ID of the user making the purchase.
 */
cartRouter.post(
    "/:id/purchase",
    schemaValidator(null, idValidatorRequired),
    checkUserRole([UserRole.USER]),
    CartController.purchase
);

export default cartRouter;
