import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import OrderList from "../../components/ui/OrderList";
import { useRouter } from "next/dist/client/router";
import { useRecoilState } from "recoil";
import { BasketData } from "../../atoms/modalAtoms";
import OrderReadOnlyItemCard from "../../components/ui/OrderReadOnlyItemCard";
import CreateOrderDto from "../../models/CreateOrderDto";
import CreateOrder from "../../models/CreateOrder";
import axios from "axios";
import CreateVariantOrderDto from "../../models/CreateVariantOrderDto";

const Payment = () => {
	const [basketData, setBasketData] = useRecoilState(BasketData);
	const router = useRouter();
	const [orderDetails, setOrderDetails] = useState<CreateOrder>({
		address: "",
		email: "",
		firstName: "",
		lastName: "",
		town: "",
		zipCode: "",
	});
	const [errorMessage, setErrorMessage] = useState("");

	const inputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setOrderDetails({ ...orderDetails, [e.target.name]: e.target.value });
	};

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setErrorMessage("");

		if (isNaN(parseInt(orderDetails.zipCode.toString())))
			setErrorMessage("Postnr kan ikke være tom");

		var newOrder: CreateOrderDto = {
			...orderDetails,
			zipCode: parseInt(orderDetails.zipCode.toString()),
			variantOrders: [
				...basketData.items.map<CreateVariantOrderDto>((item) => {
					return {
						orderedItemsTotal: item.orderedItemsTotal,
						sizeId: item.size.id,
						variantId: item.variant.id,
					};
				}),
			],
		};
		if (newOrder.variantOrders.length <= 0) router.push("/");

		axios
			.post("/api/shop/orders", newOrder)
			.then((res) => {
				setBasketData({ items: [] });
				router.push(`/order/completed?orderId=${res.data.id}`);
			})
			.catch(() => setErrorMessage("Der skete en fejl"));
	};

	if (basketData && basketData.items.length > 0)
		return (
			<div className="w-full p-3 mx-auto lg:w-[1000px]">
				<div className="flex flex-col justify-center w-full mx-auto mt-3 border">
					<div className="w-full p-3 bg-gray-900">
						<h1 className="text-white">Bestilling</h1>
					</div>
					<form onSubmit={onSubmit} className="grid grid-cols-1 gap-3 p-3 md:grid-cols-2">
						<div className="space-y-3">
							<div>
								<div className="flex space-x-3">
									<div className="w-1/2">
										<label htmlFor="firstName" className="text-sm">
											Fornavn
										</label>
										<input
											required
											type="text"
											name="firstName"
											onChange={inputOnChange}
											value={orderDetails.firstName}
											className="w-full border border-gray-700"
										/>
									</div>
									<div className="w-1/2">
										<label htmlFor="lastName" className="text-sm">
											Efternavn
										</label>
										<input
											required
											type="text"
											name="lastName"
											onChange={inputOnChange}
											value={orderDetails.lastName}
											className="w-full border border-gray-700"
										/>
									</div>
								</div>
								<div>
									<label htmlFor="email" className="text-sm">
										E-mail
									</label>
									<input
										required
										type="email"
										name="email"
										onChange={inputOnChange}
										value={orderDetails.email}
										className="w-full border border-gray-700"
									/>
								</div>
								<div>
									<label htmlFor="address" className="text-sm">
										Adresse
									</label>
									<input
										required
										type="text"
										name="address"
										onChange={inputOnChange}
										value={orderDetails.address}
										className="w-full border border-gray-700"
									/>
								</div>
								<div className="flex space-x-3">
									<div className="w-1/2">
										<label htmlFor="town" className="text-sm">
											By
										</label>
										<input
											required
											type="text"
											name="town"
											onChange={inputOnChange}
											value={orderDetails.town}
											className="w-full border border-gray-700"
										/>
									</div>
									<div className="w-1/2">
										<label htmlFor="zipCode" className="text-sm">
											Postnr.
										</label>
										<input
											required
											type="number"
											min="0"
											name="zipCode"
											onChange={inputOnChange}
											value={orderDetails.zipCode}
											className="w-full border border-gray-700"
										/>
									</div>
								</div>
							</div>
						</div>
						<div>
							<OrderList />
							<button type="submit" className="inline-block w-full p-3 mt-3 text-white bg-black">
								Bestil
							</button>
							<div className="p-3 mt-3 bg-gray-900">
								<p className="text-white">Order Details</p>
							</div>
							<div>
								{basketData.items.map((item, index) => (
									<OrderReadOnlyItemCard item={item} key={index} />
								))}
							</div>
						</div>
					</form>
				</div>
			</div>
		);
	else return <div>Ingen Produkter i kurven</div>;
};

export default Payment;
