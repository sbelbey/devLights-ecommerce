// LIBRARIES
import { Types } from "mongoose";
// INTERFACES
import { CartResponse, ICart } from "./interface";
import { IProduct } from "../product/interface";
import { TicketResponse } from "../ticket/interface";
import { UserResponse } from "../user/interface";
// DAOS
import CartDao from "./dao";
import ProductDao from "../product/dao";
import UserDao from "../user/dao";
// MODELS
import CartModel from "./model";
// SERVICES
import TicketService from "../ticket/service";
// UTILS
import HttpError from "../../utils/HttpError.utils";
// CONSTANTS
import HTTP_STATUS from "../../constants/HttpStatus";
// DTOS
import ProductDto from "../product/dto";
import UserDto from "../user/dto";

export class CartService {
    static async createCart(): Promise<ICart> {
        try {
            const cartPayload: ICart = new CartModel({
                products: [],
                createdAt: new Date(),
            });

            const cartCreated = await CartDao.create(cartPayload);
            return cartCreated;
        } catch (err: any) {
            const error: HttpError = new HttpError(
                err.description || err.message,
                err.details || err.message,
                err.status || HTTP_STATUS.SERVER_ERROR
            );

            throw error;
        }
    }

    static async addToCart(
        cartIdRequested: string,
        productId: string,
        user: string
    ): Promise<CartResponse> {
        try {
            const cartFound: ICart | null = await CartDao.getById(
                cartIdRequested
            );

            if (!cartFound) {
                const error: HttpError = new HttpError(
                    "Cart not found",
                    "Cart not found",
                    HTTP_STATUS.NOT_FOUND
                );
                throw error;
            }

            const productFound: IProduct | null = await ProductDao.getById(
                productId
            );

            if (!productFound) {
                const error: HttpError = new HttpError(
                    "Product not found",
                    "Product not found",
                    HTTP_STATUS.NOT_FOUND
                );
                throw error;
            }

            const productIndex: number = cartFound.products.findIndex(
                (item) => item.product._id.toString() === productId
            );

            if (productIndex !== -1) {
                cartFound.products[productIndex].quantity += 1;
            } else {
                cartFound.products.push({
                    product: new Types.ObjectId(productId),
                    quantity: 1,
                });
            }

            const cartModeled: ICart = {
                ...cartFound,
                updatedAt: new Date(),
            };

            const cartUpdated = await CartDao.update(
                cartIdRequested,
                cartModeled
            );

            if (!cartUpdated) {
                const error: HttpError = new HttpError(
                    "Cart not updated",
                    "Cart not updated",
                    HTTP_STATUS.NOT_FOUND
                );
                throw error;
            }

            const cartResponse: CartResponse = {
                ...cartUpdated,
                products: cartUpdated.products.map((item) => {
                    return {
                        ...item,
                        product: ProductDto.single(
                            item.product as unknown as IProduct
                        ),
                    };
                }),
            };

            return cartResponse;
        } catch (err: any) {
            const error: HttpError = new HttpError(
                err.description || err.message,
                err.details || err.message,
                err.status || HTTP_STATUS.SERVER_ERROR
            );

            throw error;
        }
    }

    static async purchase(
        cartIdRequested: string,
        user: string
    ): Promise<{
        ticketCreated: TicketResponse;
        userUpdateResponse: UserResponse;
    }> {
        try {
            const cartFound: ICart | null = await CartDao.getById(
                cartIdRequested
            );

            if (!cartFound) {
                const error: HttpError = new HttpError(
                    "Cart not found",
                    "Cart not found",
                    HTTP_STATUS.NOT_FOUND
                );
                throw error;
            }

            for (const item of cartFound.products) {
                const productFound: IProduct | null = await ProductDao.getById(
                    item.product._id.toString()
                );

                if (!productFound) {
                    const error: HttpError = new HttpError(
                        "Product not found",
                        "Product not found",
                        HTTP_STATUS.NOT_FOUND
                    );
                    throw error;
                }

                if (productFound.stock < item.quantity) {
                    const error: HttpError = new HttpError(
                        `Not enough stock for product ${productFound.title}`,
                        "INSUFFICIENT_STOCK",
                        HTTP_STATUS.BAD_REQUEST
                    );
                    throw error;
                }
            }

            const cartResponsed: CartResponse = {
                ...cartFound,
                products: cartFound.products.map((item) => {
                    return {
                        ...item,
                        product: ProductDto.single(
                            item.product as unknown as IProduct
                        ),
                    };
                }),
            };

            const userFound = await UserDao.getById(user);

            if (!userFound) {
                throw new HttpError(
                    "User not found",
                    "USER_NOT_FOUND",
                    HTTP_STATUS.NOT_FOUND
                );
            }

            const [ticketCreated, cartUpdated, cartCreated] = await Promise.all(
                [
                    TicketService.create(cartResponsed, userFound),
                    CartDao.update(cartIdRequested, {
                        ...cartFound,
                        isActive: false,
                        updatedAt: new Date(),
                    }),
                    CartService.createCart(),
                ]
            );

            if (!ticketCreated || !cartUpdated || !cartCreated) {
                const error: HttpError = new HttpError(
                    "Cart not purchased",
                    "Cart not purchased",
                    HTTP_STATUS.NOT_FOUND
                );
                throw error;
            }

            const userUpdated = await UserDao.update(user, {
                ...userFound,
                cart: cartCreated._id,
            });
            if (!userUpdated) {
                const error: HttpError = new HttpError(
                    "User not updated",
                    "User not updated",
                    HTTP_STATUS.NOT_FOUND
                );
                throw error;
            }

            const userUpdateResponse: UserResponse =
                UserDto.userDTO(userUpdated);

            for (const item of cartFound.products) {
                const productFound: IProduct | null = await ProductDao.getById(
                    item.product._id.toString()
                );

                if (productFound) {
                    const newStock = productFound.stock - item.quantity;
                    await ProductDao.update(item.product._id.toString(), {
                        stock: newStock,
                        updatedAt: new Date(),
                    });
                }
            }

            return { ticketCreated, userUpdateResponse };
        } catch (err: any) {
            const error: HttpError = new HttpError(
                err.description || err.message,
                err.details || err.message,
                err.status || HTTP_STATUS.SERVER_ERROR
            );

            throw error;
        }
    }
}
