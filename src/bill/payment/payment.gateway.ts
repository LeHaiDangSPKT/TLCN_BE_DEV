import { CreateBillDto } from "../dto/create-bill.dto";

export enum PAYMENT_METHOD {
    VNPAY = 'vnpay',
    MOMO = 'momo',
    GIVE = 'give',
}

export interface PaymentGateway {
    processPayment(bill: CreateBillDto): number;
}

export class VNPayGateway implements PaymentGateway {
    processPayment(bill: CreateBillDto): number {
        // Process vnpay payment
        return 1
    }
}

export class MoMoGateway implements PaymentGateway {
    processPayment(bill: CreateBillDto): number {
        // Process momo payment
        return 2
    }
}

export class GiveGateway implements PaymentGateway {
    processPayment(bill: CreateBillDto): number {
        return 0
    }
}