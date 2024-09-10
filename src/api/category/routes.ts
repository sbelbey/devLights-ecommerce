// LIBRARIES
import { Router } from "express";
// MIDDLEWARES
import checkUserRole from "../../middlewares/roleChecker.middlewares";
import schemaValidator from "../../middlewares/schemaValidators.middlewares";
import { idValidator } from "../../middlewares/validators/common.validator";
// VALIDATORS
import { categoryCreatePayloadValidator } from "./validator";
// CONTROLLERS
import CategoryController from "./controller";
// CONSTANTS
import { UserRole } from "../../constants/UserRole.constants";

const categoryRouter = Router();

/**
 * Create a new category.
 */
categoryRouter.post(
    "/",
    checkUserRole([UserRole.ADMIN]),
    schemaValidator(categoryCreatePayloadValidator, null),
    CategoryController.createCategory
);

/**
 * Get a list of all categories.
 */
categoryRouter.get(
    "/",
    schemaValidator(null, idValidator),
    CategoryController.getCategories
);

export default categoryRouter;
