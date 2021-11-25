import OrderDto from "./OrderDto";
import SizeDto from "./SizeDto";
import VariantDto from "./VariantDto";

interface VariantOrderDto {
    id: number
    sizeId: number
    size: SizeDto
    variantId: number
    variant: VariantDto
    orderId: number
    orderedItemsTotal: number
    price: number
    discountPrice?: number
}

export default VariantOrderDto