import React, { ReactElement } from "react";
import Button from "./Button";
import Moment from "react-moment";
import BaseOrderDto from "../models/BaseOrderDto";
import { OrderStatus } from "../models/Enums";
import { useRouter } from "next/dist/client/router";

interface Props {
	order: BaseOrderDto;
}

function OrderItem({ order }: Props): ReactElement {
	const router = useRouter();

	return (
		<>
			<div>
				<span>{order.id}</span>
			</div>
			<div>
				<span>{order.email}</span>
			</div>
			<div>
				<Moment date={order.updatedAt} format="DD-MM-yyyy"></Moment>
			</div>
			<div>
				<Moment date={order.createdAt} format="DD-MM-yyyy"></Moment>
			</div>
			<div>
				<span>{OrderStatus[order.status]}</span>
			</div>
			<div>
				<Button
					size="small"
					text="Vis"
					type="info"
					onClick={() => router.push(`/orders/${order.id}`)}></Button>
			</div>
		</>
	);
}

export default OrderItem;
