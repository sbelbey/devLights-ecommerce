// LIBRARIES
import { Router } from "express";
// MIDDLEWARES
import schemaValidator from "../../middlewares/schemaValidators.middlewares";
// VALIDATORS
import { userCreatePayloadValidator, userLoginValidator } from "./validator";
import { idValidator } from "../../middlewares/validators/common.validator";
import checkUserRole from "../../middlewares/roleChecker.middlewares";
// CONTROLLERS
import UserController from "./controller";
// CONSTANTS
import { UserRole } from "../../constants/UserRole.constants";
import { uploadFields } from "../../middlewares/uploadFields.middlewares";

const userRouter = Router();

userRouter.post(
    "/",
    uploadFields,
    schemaValidator(userCreatePayloadValidator, null),
    UserController.createUser
);

userRouter.get(
    "/:id",
    checkUserRole([UserRole.ADMIN]),
    schemaValidator(null, idValidator),
    UserController.getUser
);

userRouter.get(
    "/",
    checkUserRole([UserRole.ADMIN]),
    UserController.getAllUsers
);

userRouter.post(
    "/login",
    schemaValidator(userLoginValidator, null),
    UserController.login
);

export default userRouter;
