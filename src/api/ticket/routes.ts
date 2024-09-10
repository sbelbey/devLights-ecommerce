// LIBRARIES
import { Router } from "express";
// MIDDLEWARES
import checkUserRole from "../../middlewares/roleChecker.middlewares";
// CONTROLLERS
import TicketController from "./controller";
// CONSTANTS
import { UserRole } from "../../constants/UserRole.constants";

const ticketRouter = Router();

/**
 * Retrieves all purchases made by the current user.
 *
 */
ticketRouter.get(
    "/purchases",
    checkUserRole([UserRole.USER]),
    TicketController.getPurchases
);

/**
 * Retrieves all purchases made by the current saler.

 */
ticketRouter.get(
    "/purchases/saler",
    checkUserRole([UserRole.SALER]),
    TicketController.getPurchaseBySaler
);

/**
 * Retrieves all purchases made by the specified user.
 *
 * @param id - The ID of the user to retrieve purchases for.
 */
ticketRouter.get(
    "/purchases/user/:id",
    checkUserRole([UserRole.ADMIN]),
    TicketController.getAllPurchaseByUser
);

export default ticketRouter;
