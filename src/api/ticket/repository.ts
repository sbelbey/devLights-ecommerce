// LIBRARIES
import { Types } from "mongoose";
// INTERFACES
import { ITicketPopulated, salesOfASaler } from "./interface";
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
