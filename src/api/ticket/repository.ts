// INTERFACES
import { ITicketPopulated } from "./interface";
// MODELS
import TicketModel from "./model";

export default class TicketRepository {
    static async findTicketsByBuyerId(
        userId: string
    ): Promise<ITicketPopulated[]> {
        return TicketModel.find({ buyerId: userId })
            .populate(["cartId", "buyerId"])
            .populate({
                path: "cartId",
                populate: {
                    path: "products.product",
                    select: "title price",
                    model: "Product",
                },
            })
            .lean();
    }
}
