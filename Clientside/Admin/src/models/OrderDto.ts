import BaseOrderDto from "./BaseOrderDto";
import VariantOrderDto from "./VariantOrderDto";

interface OrderDto extends BaseOrderDto {
    firstName: string
    lastName: string
    address: string
    town: string
    zipCode: string
    variantOrders: VariantOrderDto[]
}

export default OrderDto;