import React, { ReactElement } from "react";
import styles from "./OrderList.module.css";
import OrderItem from "./OrderItem";
import BaseOrderDto from "../models/BaseOrderDto";

interface Props {
	orders: BaseOrderDto[];
}

function OrderList({ orders }: Props): ReactElement {
	return (
		<div className="flex flex-row overflow-hidden">
			<div className={styles["orderlist"]}>
				<div>Ordre Nr.</div>
				<div>Email</div>
				<div>Ændret</div>
				<div>Oprettet</div>
				<div>Status</div>
				<div></div>
				{/* Rows */}
				{orders.map((order) => (
					<OrderItem key={order.id} order={order}></OrderItem>
				))}
			</div>
		</div>
	);
}

export default OrderList;
