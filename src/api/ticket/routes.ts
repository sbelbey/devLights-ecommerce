// LIBRARIES
import { Router } from "express";
// MIDDLEWARES
import checkUserRole from "../../middlewares/roleChecker.middlewares";
// CONTROLLERS
import TicketController from "./controller";
// CONSTANTS
import { UserRole } from "../../constants/UserRole.constants";

const ticketRouter = Router();

ticketRouter.get(
    "/purchases",
    checkUserRole([UserRole.USER]),
    TicketController.getPurchases
);

ticketRouter.get(
    "/purchases/saler",
    checkUserRole([UserRole.SALER]),
    TicketController.getPurchaseBySaler
);

export default ticketRouter;
