import { Router } from "express";
import schemaValidator from "../../middlewares/schemaValidators.middlewares";
import { userCreatePayloadValidator, userLoginValidator } from "./validator";
import UserController from "./controller";
import { idValidator } from "../../middlewares/validators/common.validator";

const userRouter = Router();

userRouter.post(
    "/",
    schemaValidator(userCreatePayloadValidator, null),
    UserController.createUser
);

userRouter.get("/", schemaValidator(null, idValidator), UserController.getUser);

userRouter.post(
    "/login",
    schemaValidator(userLoginValidator, null),
    UserController.login
);

export default userRouter;
