import BaseVariantDto from "./BaseVariantDto";
import ColorDto from "./ColorDto";
import InventoryInfoDto from "./InventoryInfoDto";
import ProductDto from "./ProductDto";

interface VariantDto extends BaseVariantDto {
    product: ProductDto
    inventoryInfos: InventoryInfoDto[]
}

export default VariantDto