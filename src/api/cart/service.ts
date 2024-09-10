// LIBRARIES
import { Types } from "mongoose";
// INTERFACES
import { CartPopulated, CartResponse, ICart } from "./interface";
import { ProductFindPopulated } from "../product/interface";
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
    static async createCart(): Promise<CartPopulated> {
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
            const cartFound: CartPopulated | null = await CartDao.getById(
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

            const productFound: ProductFindPopulated | null =
                await ProductDao.getById(productId);

            if (!productFound) {
                const error: HttpError = new HttpError(
                    "Product not found",
                    "Product not found",
                    HTTP_STATUS.NOT_FOUND
                );
                throw error;
            }

            let firstProduct:
                | { product: Types.ObjectId; quantity: number }
                | undefined = undefined;

            if (
                !cartFound.products.length ||
                cartFound.products.some(
                    (item) => item.product._id.toString() !== productId
                )
            ) {
                firstProduct = {
                    product: new Types.ObjectId(productFound._id),
                    quantity: 1,
                };
            }

            const cartModeled: ICart = {
                ...cartFound,
                products: [
                    ...(firstProduct ? [firstProduct] : []),
                    ...cartFound.products.map((individualProduct) => {
                        if (
                            individualProduct.product._id.toString() ===
                            productId
                        ) {
                            return {
                                product: individualProduct.product._id,
                                quantity: individualProduct.quantity + 1,
                            };
                        }
                        return {
                            product: individualProduct.product._id,
                            quantity: individualProduct.quantity,
                        };
                    }),
                ],
                updatedAt: new Date(),
            };

            const cartUpdated: CartPopulated | null = await CartDao.update(
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
                            item.product as unknown as ProductFindPopulated
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
            const cartFound: CartPopulated | null = await CartDao.getById(
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
                if (
                    item.product.stock < item.quantity &&
                    !item.product.status
                ) {
                    const error: HttpError = new HttpError(
                        `Not enough stock for product ${item.product.title}`,
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
                            item.product as unknown as ProductFindPopulated
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
                    } as unknown as ICart),
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
                const productFound: ProductFindPopulated | null =
                    await ProductDao.getById(item.product._id.toString());

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
