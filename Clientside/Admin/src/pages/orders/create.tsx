import axios, { AxiosError, AxiosResponse } from "axios";
import React, { useState } from "react";
import Button from "../../components/Button";
import Header from "../../components/Header";
import { useRouter } from "next/dist/client/router";
import CreateOrderDto from "../../models/CreateOrderDto";
import OrderVariantItem from "../../components/OrderVariantItem";
import CreateVariantOrderDto from "../../models/CreateVariantOrderDto";

const CreateOrder = () => {
	const [newOrder, setNewOrder] = useState<CreateOrderDto>({
		firstName: "",
		lastName: "",
		address: "",
		email: "",
		town: "",
		zipCode: 0,
		variantOrders: [],
	});
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	var router = useRouter();

	const addOrderVariant = (variant: CreateVariantOrderDto) => {
		let variants = [...newOrder.variantOrders];

		let exists = false;

		variants.forEach((element) => {
			if (element.variantId == variant.variantId && element.sizeId == variant.sizeId) {
				element.orderedItemsTotal += variant.orderedItemsTotal;
				exists = true;
			}
		});

		if (!exists) variants.push(variant);

		setNewOrder({ ...newOrder, variantOrders: variants });
	};

	const orderVariantOnChange = (variant: CreateVariantOrderDto, index: number) => {
		let variants = [...newOrder.variantOrders];

		variants[index] = variant;
		setNewOrder({ ...newOrder, variantOrders: variants });
	};

	const orderVariantOnDelete = (index: number) => {
		let variants = [...newOrder.variantOrders];

		variants.splice(index, 1);
		setNewOrder({ ...newOrder, variantOrders: variants });
	};

	const cancelOnClick = (e: React.MouseEvent) => {
		router.push("/orders");
	};

	const inputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.name == "zipCode")
			setNewOrder({ ...newOrder, [e.target.name]: parseInt(e.target.value) });
		else setNewOrder({ ...newOrder, [e.target.name]: e.target.value });
	};

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		var data: CreateOrderDto = { ...newOrder };

		setErrorMessage("");

		if (data.variantOrders.length == 0) {
			setErrorMessage("Varianter skal tilføjes!");
			setIsLoading(false);
			return;
		}

		var tempVariants: CreateVariantOrderDto[] = [];

		data.variantOrders.forEach((variant) => {
			let exists = false;

			tempVariants.forEach((v) => {
				if (v.variantId == variant.variantId && v.sizeId == variant.sizeId) {
					v.orderedItemsTotal += variant.orderedItemsTotal;
					exists = true;
				}
			});

			if (exists) return;

			delete variant.product;
			delete variant.inventoryInfos;
			tempVariants.push(variant);
		});

		axios
			.post("/api/admin/orders", data)
			.then((res: AxiosResponse) => {
				router.push("/orders/" + res.data.id);
			})
			.catch((err: AxiosError) => {
				console.log(err);
				if (err.response?.status === 400) setErrorMessage(err.response.data.errorMessage);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	return (
		<div>
			<Header title="Opret ordre"></Header>

			<div className="w-[1000px] mx-auto">
				<form autoComplete="off" onSubmit={onSubmit}>
					<h1>Kunde Oplysninger</h1>
					<div className="grid grid-cols-2 p-10 bg-white rounded-lg">
						<div className="flex flex-col mr-4">
							<label htmlFor="firstName" className="font-semibold">
								FirstName
							</label>
							<input
								required
								value={newOrder.firstName}
								onChange={inputOnChange}
								type="text"
								name="firstName"
								className="p-3  h-[40px] focus-visible:outline-none w-full border rounded-md"></input>
						</div>
						<div className="flex flex-col ml-4">
							<label htmlFor="lastName" className="font-semibold">
								LastName
							</label>
							<input
								required
								value={newOrder.lastName}
								onChange={inputOnChange}
								type="text"
								name="lastName"
								className="p-3  h-[40px] focus-visible:outline-none w-full border rounded-md"></input>
						</div>
						<div className="flex flex-col mr-4">
							<label htmlFor="address" className="font-semibold">
								Address
							</label>
							<input
								required
								value={newOrder.address}
								onChange={inputOnChange}
								name="address"
								className="p-3  h-[40px] focus-visible:outline-none w-full border rounded-md"
							/>
						</div>
						<div className="flex flex-col ml-4">
							<label htmlFor="email" className="font-semibold">
								Email
							</label>
							<input
								type="email"
								required
								value={newOrder.email}
								onChange={inputOnChange}
								name="email"
								className="p-3  h-[40px] focus-visible:outline-none w-full border rounded-md"
							/>
						</div>
						<div className="flex flex-col mr-4">
							<label htmlFor="town" className="font-semibold">
								By
							</label>
							<input
								required
								value={newOrder.town}
								onChange={inputOnChange}
								name="town"
								className="p-3  h-[40px] focus-visible:outline-none w-full border rounded-md"
							/>
						</div>
						<div className="flex flex-col ml-4">
							<label htmlFor="zipCode" className="font-semibold">
								Postnr.
							</label>
							<input
								required
								type="number"
								value={newOrder.zipCode}
								onChange={inputOnChange}
								name="zipCode"
								className="p-3  h-[40px] focus-visible:outline-none w-full border rounded-md"
							/>
						</div>
					</div>

					<h1>Vare Oplysninger</h1>
					<div
						className="grid p-10 bg-white rounded-lg ordervariantlist"
						style={{
							gridTemplateColumns: "repeat(3, minmax(0, 1fr)) auto",
							gridTemplateRows: "auto auto",
						}}>
						<OrderVariantItem addOnClick={addOrderVariant} isBlue />
						{newOrder.variantOrders.map((v, index) => (
							<OrderVariantItem
								key={index}
								onChange={(e) => orderVariantOnChange(e, index)}
								variant={v}
								deleteOnClick={() => orderVariantOnDelete(index)}
							/>
						))}
					</div>

					<div className="mt-3">
						<p className="text-red-500">{errorMessage}</p>
					</div>

					<div className="flex justify-between">
						<Button
							disabled={isLoading}
							onClick={cancelOnClick}
							size="large"
							text="Annuler"
							type="error"
							className="mt-8"></Button>
						<Button
							disabled={isLoading}
							size="large"
							text="Opret"
							buttonType="submit"
							type="success"
							className="mt-8"></Button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default CreateOrder;
