import React, { ReactElement } from "react";
import VariantOrderDto from "../models/VariantOrderDto";

interface Props {
	orderItem: VariantOrderDto;
}

function OrderListItem({ orderItem }: Props): ReactElement {
	return (
		<>
			<div>
				<span>{orderItem.variantId}</span>
			</div>
			<div>
				<span>{orderItem.variant.product.brand}</span>
			</div>
			<div>
				<span>{orderItem.variant.product.model}</span>
			</div>
			<div>
				<span>{orderItem.size.sizeName}</span>
			</div>
			<div>
				<span>{orderItem.orderedItemsTotal}</span>
			</div>
			<div>
				<span>{(orderItem.discountPrice ?? orderItem.price) * orderItem.orderedItemsTotal}</span>
			</div>
		</>
	);
}

export default OrderListItem;
