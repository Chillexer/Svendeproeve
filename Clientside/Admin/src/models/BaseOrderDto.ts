import { OrderStatus } from "./Enums";

interface BaseOrderDto {

    id: number
    email: string
    status: OrderStatus
    createdAt?: Date
    updatedAt?: Date
}

export default BaseOrderDto