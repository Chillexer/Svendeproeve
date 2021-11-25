import BaseVariantDto from "./BaseVariantDto";
import InventoryInfoDto from "./InventoryInfoDto";

interface VariantWithoutProductDto extends BaseVariantDto {
    inventoryInfos: InventoryInfoDto[]
}

export default VariantWithoutProductDto