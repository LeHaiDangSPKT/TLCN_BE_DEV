import { Injectable } from '@nestjs/common';
import { PaymentGateway, PAYMENT_METHOD } from './payment.gateway';
import { CreateBillDto } from '../dto/create-bill.dto';
import { NotFoundExceptionCustom } from 'src/exceptions/NotFoundExceptionCustom.exception';

@Injectable()
export class PaymentService {
    private paymentGateways: Record<string, PaymentGateway> = {};

    public registerPaymentGateway(
        paymentMethod: PAYMENT_METHOD,
        gateway: PaymentGateway,
    ) {
        this.paymentGateways[paymentMethod] = gateway;
    }

    public async processPayment(bill: CreateBillDto, paymentMethod: PAYMENT_METHOD) : Promise<number> {
        const gateway = this.paymentGateways[paymentMethod];
        if (gateway) {
            return await gateway.processPayment(bill);
        } else {
            throw new NotFoundExceptionCustom("PaymentMethod");
        }
    }
}