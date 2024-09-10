// LIBRARIES
import { Types } from "mongoose";
// INTERFACES
import { ITicketPopulated, salesOfASaler } from "./interface";
// MODELS
import TicketModel from "./model";

/**
 * Provides methods for interacting with ticket data in the database.
 */
export default class TicketRepository {
    /**
     * Finds all tickets associated with the given buyer ID.
     *
     * @param userId - The ID of the buyer to find tickets for.
     * @returns A Promise that resolves to an array of populated ticket objects.
     */
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

    /**
     * Finds all tickets associated with the given seller ID, including the total number of tickets, total products, total amount, and a list of the tickets.
     *
     * @param userId - The ID of the seller to find tickets for.
     * @returns A Promise that resolves to an object containing the sales data for the given seller.
     */
    static async findTicketsBySellerId(userId: string): Promise<salesOfASaler> {
        const salerId = new Types.ObjectId(userId);
        const tickets = await TicketModel.aggregate([
            {
                $lookup: {
                    from: "carts",
                    localField: "cartId",
                    foreignField: "_id",
                    as: "cart",
                },
            },
            { $unwind: "$cart" },
            { $unwind: "$cart.products" },
            {
                $lookup: {
                    from: "products",
                    localField: "cart.products.product",
                    foreignField: "_id",
                    as: "product",
                },
            },
            { $unwind: "$product" },
            {
                $match: {
                    "product.createdBy": salerId,
                },
            },
            {
                $group: {
                    _id: "$_id",
                    totalProducts: { $sum: 1 },
                    totalAmount: {
                        $sum: {
                            $multiply: [
                                "$cart.products.quantity",
                                "$product.price",
                            ],
                        },
                    },
                    products: { $push: "$product._id" },
                },
            },
            {
                $group: {
                    _id: salerId,
                    totalTickets: { $sum: 1 },
                    totalProducts: { $sum: "$totalProducts" },
                    totalAmount: { $sum: "$totalAmount" },
                    tickets: { $push: "$$ROOT" },
                },
            },
        ]);

        return tickets[0];
    }
}
