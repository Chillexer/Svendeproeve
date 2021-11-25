import ColorDto from "./ColorDto";

interface BaseVariantDto {
    id: number
    productId: number
    imagePath: string
    discountPrice?: number
    colors: ColorDto[]
    createdAt: Date
    updatedAt: Date
}

export default BaseVariantDto