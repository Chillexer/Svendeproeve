import { ChevronRightIcon } from "@heroicons/react/solid";
import axios from "axios";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import React, { ReactElement, useEffect, useState } from "react";
import Moment from "react-moment";
import BaseOrderDto from "../models/BaseOrderDto";
import { OrderStatus } from "../models/Enums";

interface Props {}

function DashboardOrders({}: Props): ReactElement {
	const router = useRouter();

	const [orders, setOrders] = useState<BaseOrderDto[]>([]);

	useEffect(() => {
		axios
			.get("/api/admin/orders")
			.then((res) => {
				setOrders(res.data);
			})
			.catch((err) => console.log(err));
	}, []);

	return (
		<div className="flex flex-col">
			<div className="flex items-center justify-between">
				<h2 className="text-lg">Nyeste Ordrer</h2>{" "}
				<Link href="/orders" passHref>
					<div className="flex items-center text-gray-400 cursor-pointer">
						<p className="text-lg">Alle ordrer</p>{" "}
						<ChevronRightIcon className="w-8 h-8"></ChevronRightIcon>
					</div>
				</Link>
			</div>

			<div className="flex-1 mt-1 bg-white rounded-xl">
				{orders &&
					orders.map((order) => (
						<div
							key={order.id}
							className="flex justify-between p-4 text-3xl cursor-pointer hover:bg-gray-100"
							onClick={() => router.push(`/orders/${order.id}`)}>
							<div className="w-1/12 font-bold">#{order.id}</div>
							<div className="w-4/12 overflow-hidden overflow-ellipsis">{order.email}</div>
							<div className="w-4/12 overflow-hidden text-gray-500 overflow-ellipsis whitespace-nowrap">
								<Moment date={order.createdAt} format="DD-MM-yyyy HH:mm"></Moment>
							</div>
							<div className="w-1/12 text-green-600">{OrderStatus[order.status]}</div>
						</div>
					))}
			</div>
		</div>
	);
}

export default DashboardOrders;
