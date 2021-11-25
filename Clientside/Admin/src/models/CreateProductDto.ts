import { SizeType } from "./Enums";

interface CreateProductDto {
    brand: string,
    model: string,
    description: string,
    genderId: number,
    price: number,
    sizeType: SizeType,
    categoryIds: number[]
}


export type { CreateProductDto }