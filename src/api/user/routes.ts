import { Router } from "express";
import schemaValidator from "../../middlewares/schemaValidators.middlewares";
import { userCreatePayloadValidator } from "../../middlewares/validators/user.validator";
import UserController from "./controller";
import { idValidator } from "../../middlewares/validators/common.validator";

const userRouter = Router();

userRouter.post(
    "/",
    schemaValidator(userCreatePayloadValidator, null),
    UserController.createUser
);

userRouter.get(
    "/:id",
    schemaValidator(null, idValidator),
    UserController.getUser
);

export default userRouter;
