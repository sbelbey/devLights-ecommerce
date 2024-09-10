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

/**
 * Handles the login process for a user.
 *
 */
userRouter.post(
    "/login",
    schemaValidator(userLoginValidator, null),
    UserController.login
);

/**
 * Handles the creation of a new user.
 *
 */
userRouter.post(
    "/",
    uploadFields,
    schemaValidator(userCreatePayloadValidator, null),
    UserController.createUser
);

/**
 * Updates a user's information.
 *
 */
userRouter.put(
    "/",
    uploadFields,
    checkUserRole([UserRole.ADMIN, UserRole.USER, UserRole.SALER]),
    schemaValidator(userUpdattePayloadValidator, idValidator),
    UserController.updateUser
);

/**
 * Assigns a new role to a user.
 *
 * This endpoint is only accessible to users with the 'ADMIN' role.

 * @param id - The ID of the user to assign the new role to.
 */
userRouter.put(
    "/newRole/:id",
    checkUserRole([UserRole.ADMIN]),
    schemaValidator(assertRole, idValidator),
    UserController.assignRole
);

/**
 * Retrieves a single user by their ID.
 *
 *  * This endpoint is only accessible to users with the 'ADMIN' role.
 * @param id - The ID of the user to retrieve.
 */
userRouter.get(
    "/:id",
    checkUserRole([UserRole.ADMIN]),
    schemaValidator(null, idValidator),
    UserController.getUser
);

/**
 * Retrieves all users.
 *
 * This endpoint is only accessible to users with the 'ADMIN' role.
 */
userRouter.get(
    "/",
    checkUserRole([UserRole.ADMIN]),
    UserController.getAllUsers
);

export default userRouter;
