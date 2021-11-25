import BaseProductDto from "./BaseProductDto";
import BaseVariantDto from "./BaseVariantDto";

interface BasketVariant extends BaseVariantDto {
    product: BaseProductDto
}

export default BasketVariant