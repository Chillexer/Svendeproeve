import CreateVariantInventoryInfoDto from "./CreateVariantInventoryInfoDto";

interface CreateVariantDto {
	productId: number
	imagePath: string,
	discountPrice?: number,
	colorIds: number[],
	inventoryInfos: CreateVariantInventoryInfoDto[],
}

export default CreateVariantDto