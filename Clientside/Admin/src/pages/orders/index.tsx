import type { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Search from "../../components/Search";
import OrderList from "../../components/OrderList";
import BaseOrderDto from "../../models/BaseOrderDto";
import axios from "axios";
import { OrderStatus } from "../../models/Enums";

const Order = () => {
	const [orders, setOrders] = useState<BaseOrderDto[]>([]);
	const [selectedStatuses, setSelectedStatuses] = useState<boolean[]>([
		false,
		false,
		false,
		false,
		false,
	]);
	const [search, setSearch] = useState<string>("");
	const [currentSearch, setCurrentSearch] = useState<string>("");
	var router = useRouter();

	const SearchOnClick = (e: React.MouseEvent) => {
		setCurrentSearch(search);
	};

	const CreateOnClick = (e: React.MouseEvent) => {
		router.push("/orders/create");
	};

	const handleCheckboxOnChange = (i: OrderStatus) => {
		var newSelectedStatuses = [...selectedStatuses];
		newSelectedStatuses[i] = !newSelectedStatuses[i];
		setSelectedStatuses(newSelectedStatuses);
	};

	useEffect(() => {
		let statuses: number[] = [];
		selectedStatuses.forEach((s, i) => {
			if (s) statuses.push(i);
		});

		axios
			.get<BaseOrderDto[]>("/api/admin/orders", {
				params: {
					search: currentSearch.trim().length > 0 ? currentSearch : undefined,
					statuses: statuses,
				},
			})
			.then((res) => {
				setOrders(res.data);
			})
			.catch((err) => console.log(err));
	}, [currentSearch, selectedStatuses]);

	return (
		<div className="grid h-screen" style={{ gridTemplateRows: "auto 1fr" }}>
			<Header title="Ordrer" hasButton onClick={CreateOnClick}></Header>

			<div className="flex justify-between px-6 pb-10">
				{/* Search Area */}
				<div
					className="min-w-[250px] bg-white px-3 py-3 rounded-lg"
					style={{ height: "fit-content" }}>
					<Search
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						onSearch={SearchOnClick}></Search>
					<div className="mt-3 border rounded-xl">
						{selectedStatuses.map((s, i) => (
							<div key={i}>
								<input
									className="mx-2"
									type="checkbox"
									onChange={() => handleCheckboxOnChange(i)}
									checked={s}
									id="Web-Admin"
								/>
								<label htmlFor="Web-Admin">{OrderStatus[i]}</label>
							</div>
						))}
					</div>
				</div>

				<div className="flex-grow h-full ml-6 bg-white rounded-lg">
					<OrderList orders={orders}></OrderList>
				</div>
			</div>
		</div>
	);
};

export default Order;
