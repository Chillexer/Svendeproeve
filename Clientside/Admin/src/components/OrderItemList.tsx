import React, { ReactElement } from "react";
import styles from "./OrderItemList.module.css";
import OrderListItem from "./OrderListItem";
import VariantOrderDto from "../models/VariantOrderDto";

interface Props {
	orderItems: VariantOrderDto[];
}

function OrderItemList({ orderItems }: Props): ReactElement {
	return (
		<div className="flex flex-row overflow-hidden">
			<div className={styles["orderitemlist"]}>
				<div>ProduktNr</div>
				<div>Mærke</div>
				<div>Model</div>
				<div>Størrelse</div>
				<div>Antal</div>
				<div>Pris</div>
				{/* Rows */}
				{orderItems &&
					orderItems.map((orderItem) => (
						<OrderListItem key={orderItem.id} orderItem={orderItem}></OrderListItem>
					))}
			</div>
		</div>
	);
}

export default OrderItemList;
