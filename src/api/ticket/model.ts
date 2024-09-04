// LIBRARIES
import { model, Schema } from "mongoose";
// INTERFACES
import { ITicket } from "./interface";

const ticketCollection = "Ticket";

const TicketSchema = new Schema<ITicket>({
    cartId: { type: Schema.Types.ObjectId, ref: "Cart", required: true },
    buyerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
});

const TicketModel = model<ITicket>(ticketCollection, TicketSchema);

export default TicketModel;
