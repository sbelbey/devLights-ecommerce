// LIBRARIES
import { Router } from "express";
// MIDDLEWARES
import schemaValidator from "../../middlewares/schemaValidators.middlewares";
import { uploadFields } from "../../middlewares/uploadFields.middlewares";
// VALIDATORS
import {
    assertRole,
    userCreatePayloadValidator,
    userLoginValidator,
    userUpdattePayloadValidator,
} from "./validator";
import { idValidator } from "../../middlewares/validators/common.validator";
import checkUserRole from "../../middlewares/roleChecker.middlewares";
// CONTROLLERS
import UserController from "./controller";
// CONSTANTS
import { UserRole } from "../../constants/UserRole.constants";

const userRouter = Router();

userRouter.post(
    "/login",
    schemaValidator(userLoginValidator, null),
    UserController.login
);

userRouter.post(
    "/",
    uploadFields,
    schemaValidator(userCreatePayloadValidator, null),
    UserController.createUser
);

userRouter.put(
    "/",
    uploadFields,
    checkUserRole([UserRole.ADMIN, UserRole.USER, UserRole.SALER]),
    schemaValidator(userUpdattePayloadValidator, idValidator),
    UserController.updateUser
);

userRouter.put(
    "/newRole/:id",
    checkUserRole([UserRole.ADMIN]),
    schemaValidator(assertRole, idValidator),
    UserController.assignRole
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

export default userRouter;
