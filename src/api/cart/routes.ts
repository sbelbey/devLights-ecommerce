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

cartRouter.post(
    "/:id/product/:productId",
    schemaValidator(null, idValidatorRequired),
    checkUserRole([UserRole.USER]),
    CartController.addToCart
);

cartRouter.post(
    "/:id/purchase",
    schemaValidator(null, idValidatorRequired),
    checkUserRole([UserRole.USER]),
    CartController.purchase
);

export default cartRouter;
