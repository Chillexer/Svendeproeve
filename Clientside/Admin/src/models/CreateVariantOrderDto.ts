import InventoryInfoDto from "./InventoryInfoDto";
import ProductDto from "./ProductDto";

interface CreateVariantOrderDto {
    sizeId: number,
    variantId: number,
    orderedItemsTotal: number,
    product?: ProductDto
    inventoryInfos?: InventoryInfoDto[]
}


export default CreateVariantOrderDto