import { Router } from "express";
import checkUserRole from "../../middlewares/roleChecker.middlewares";
import { UserRole } from "../../constants/UserRole.constants";
import schemaValidator from "../../middlewares/schemaValidators.middlewares";
import { categoryCreatePayloadValidator } from "./validator";
import CategoryController from "./controller";
import { idValidator } from "../../middlewares/validators/common.validator";

const categoryRouter = Router();

categoryRouter.post(
    "/",
    checkUserRole([UserRole.ADMIN]),
    schemaValidator(categoryCreatePayloadValidator, null),
    CategoryController.createCategory
);

categoryRouter.get(
    "/",
    schemaValidator(null, idValidator),
    CategoryController.getCategories
);

export default categoryRouter;
