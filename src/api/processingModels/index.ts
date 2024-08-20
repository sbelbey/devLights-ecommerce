import { getModelForClass } from "@typegoose/typegoose";
import { Cart } from "../cart/model";
import { Product } from "../product/model";
import { User } from "../user/model";
import { Category } from "../category/model";

export const CartModel = getModelForClass(Cart);
export const ProductModel = getModelForClass(Product);
export const UserModel = getModelForClass(User);
export const CategoryModel = getModelForClass(Category);
