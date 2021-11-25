import BaseProductDto from "./BaseProductDto";
import { SizeType } from "./Enums";
import VariantWithoutProductDto from "./VariantWithoutProductDto";

interface ProductWithVariantsDto extends BaseProductDto {
    id: number,
    brand: string,
    model: string
    price: number
    description: string
    sizeType: SizeType
    variants?: VariantWithoutProductDto[]
}

export default ProductWithVariantsDto;