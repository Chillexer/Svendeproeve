import BasketItem from "./BasketItem";
import CreateVariantOrderDto from "./CreateVariantOrderDto";

interface CreateOrderDto {
    firstName: string,
    lastName: string,
    address: string,
    email: string,
    town: string,
    zipCode: number,
    variantOrders: CreateVariantOrderDto[]
}


export default CreateOrderDto