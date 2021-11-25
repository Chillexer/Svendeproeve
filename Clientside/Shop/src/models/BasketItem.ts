import BasketVariant from "./BasketVariant";
import SizeDto from "./SizeDto";

interface BasketItem {
    variant: BasketVariant
    size: SizeDto
    orderedItemsTotal: number
}

export default BasketItem