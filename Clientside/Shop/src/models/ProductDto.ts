import BaseProductDto from "./BaseProductDto";
import BaseVariantDto from "./BaseVariantDto";
import { SizeType } from "./Enums";
import GenderDto from "./GenderDto";
import SearchCategoryDto from "./SearchCategoryDto";

interface ProductDto extends BaseProductDto {
    description: string
    genderId: number
    gender: GenderDto
    sizeType: SizeType
    variants?: BaseVariantDto[]
    categories: SearchCategoryDto[]
}

export default ProductDto;