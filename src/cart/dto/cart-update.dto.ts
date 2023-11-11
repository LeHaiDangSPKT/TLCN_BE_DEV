import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { ProductBillDto } from "src/bill/dto/product-bill.dto";

export class UpdateCartDto {
    @ApiProperty()
    @IsNotEmpty()
    storeName: string;

    @ApiProperty({ type: [ProductBillDto] })
    listProducts: ProductBillDto[];
}