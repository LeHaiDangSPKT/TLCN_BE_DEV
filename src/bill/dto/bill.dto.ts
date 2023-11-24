import { PAYMENT_METHOD } from "../payment/payment.gateway";
import { Store } from "src/store/schema/store.schema";
import { Product } from "src/product/schema/product.schema";
import { GiveInfo, ProductInfo, ReceiverInfo } from "./create-bill.dto";
import { User } from "src/user/schema/user.schema";

export class ProductFullInfo {
    product: Product;
    subInfo: ProductInfo;
}

export class BillDto {
    id: string;
    storeInfo: Store;
    listProductsFullInfo: ProductFullInfo[];
    userInfo: User;
    notes: string;
    totalPrice: number;
    deliveryMethod: string;
    paymentMethod: PAYMENT_METHOD;
    receiverInfo: ReceiverInfo;
    giveInfo: GiveInfo | null;
    deliveryFee: number;
    status: string;
    isPaid: boolean;
    createdAt: Date;
}