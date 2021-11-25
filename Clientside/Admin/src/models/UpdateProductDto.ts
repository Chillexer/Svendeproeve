import { SizeType } from "./Enums";

interface UpdateProductDto {
    brand: string,
    model: string,
    description: string,
    genderId: number,
    price: number,
    sizeType: SizeType,
    categoryIds: number[]
}


export type { UpdateProductDto }