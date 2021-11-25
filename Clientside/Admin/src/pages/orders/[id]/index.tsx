import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/dist/client/router";
import React, { useEffect, useRef, useState } from "react";
import Moment from "react-moment";
import Button from "../../../components/Button";
import { OrderStatus, SizeType } from "../../../models/Enums";
import OrderDto from "../../../models/OrderDto";
import OrderItemList from "../../../components/OrderItemList";

const Order = () => {
	const [order, setOrder] = useState<OrderDto>();
	const [status, setStatus] = useState<OrderStatus>();
	const [error, setError] = useState("");
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const modalRef = useRef<HTMLDivElement>(null);
	const router = useRouter();
	const { id } = router.query;

	const createOnClick = (e: React.MouseEvent) => {
		// router.push(`/orders/${id}/variants/create`);
	};

	const backOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		router.push("/orders");
	};

	const deleteOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		axios
			.delete(`/api/admin/orders/${order?.id}`)
			.then((res: AxiosResponse) => {
				router.push("/orders");
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const onMouseDown = (e: MouseEvent) => {
		if (modalRef && !modalRef.current?.contains(e.target as Node)) {
			document.removeEventListener("mousedown", onMouseDown);
			setIsModalOpen(false);
		}
	};

	const saveOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (!order || !status) {
			setError("Der skete en fejl 😥");
			return;
		}
		setError("");

		axios
			.put(`/api/admin/orders/${order.id}`, { status })
			.then((res) => {
				if (res.status == 200) {
					var updatedOrder = { ...order, status };
					setOrder(updatedOrder);
					document.removeEventListener("mousedown", onMouseDown);
					setIsModalOpen(false);
				}
			})
			.catch((err) => {
				setError("Der skete en fejl 😥");
			});
	};

	const modalOnOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (modalRef) {
			document.addEventListener("mousedown", onMouseDown);
			return setIsModalOpen(true);
		}
	};

	const getTotalPrice = (): number => {
		let price = 0;
		order?.variantOrders.forEach((item) => {
			price += item.price * item.orderedItemsTotal;
		});
		return price;
	};

	useEffect(() => {
		axios
			.get<OrderDto>(`/api/admin/orders/${id}`)
			.then((res) => {
				setOrder(res.data);
				setStatus(res.data.status);
			})
			.catch((err) => {
				console.log(err);
				router.push("/orders");
			});
	}, [id]);

	return (
		<div>
			<div
				className={`${
					isModalOpen ? "" : "hidden"
				} left-[250px] right-0 h-screen fixed flex items-center justify-center bg-gray-400/[0.15]`}>
				<div
					ref={modalRef}
					className="flex flex-col items-center p-6 space-y-4 bg-white rounded-lg ">
					<label htmlFor="status">Status</label>
					<select
						name="status"
						value={status}
						onChange={(e) => setStatus(parseInt(e.target.value))}
						className="w-full border rounded-md">
						<option value={OrderStatus.New}>Ny</option>
						<option value={OrderStatus.Packing}>Pakker</option>
						<option value={OrderStatus.Sent}>Sendt</option>
						<option value={OrderStatus.Delivered}>Leveret</option>
						<option value={OrderStatus.Cancelled}>Annulleret</option>
					</select>
					{error && <div className="text-red-500">{error}</div>}

					<Button
						onClick={saveOnClick}
						className=""
						size="large"
						text="Gem Status"
						type="success"></Button>
				</div>
			</div>

			{order && (
				<>
					<div className="w-[1000px] mx-auto space-y-3 mx pt-10">
						<div className="p-3 bg-white rounded-lg">
							<div className="flex justify-between border-b-2 border-gray-700">
								<div className="flex space-x-1">
									<h1 className="text-2xl font-bold">#{order.id}</h1>
								</div>
								<div className="text-2xl font-bold ">
									<h2 className="flex space-x-1">Status: {OrderStatus[order.status]}</h2>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-2">
								<div className="grid grid-cols-2 gap-2" style={{ gridTemplateColumns: "auto 1fr" }}>
									<h2 className="font-medium">Navn:</h2>
									<div>
										{order.firstName} {order.lastName}
									</div>

									<h2 className="font-medium">Email:</h2>
									<div>{order.email}</div>

									<h2 className="font-medium">Oprettet:</h2>
									<div>
										<Moment date={order.createdAt} format="DD-MM-yyyy"></Moment>
									</div>
								</div>

								<div className="grid gap-2" style={{ gridTemplateColumns: "auto 1fr" }}>
									<h2 className="font-medium">Adresse:</h2>
									<div>{order.address}</div>

									<h2 className="font-medium">By:</h2>
									<div>{order.town}</div>

									<h2 className="font-medium">Postnr.:</h2>
									<div>{order.zipCode}</div>
								</div>
							</div>
						</div>

						<div className="w-full pb-3 bg-white rounded-lg">
							<OrderItemList orderItems={order.variantOrders}></OrderItemList>
							<div className="flex justify-end mt-3 mr-3">
								<h2 className="mr-3 font-medium">Pris i Alt:</h2>
								<div>{getTotalPrice()}</div>
							</div>
						</div>
						<div className="flex col-span-2 mt-6">
							<Button onClick={backOnClick} size="large" text="Tilbage" type="secondary"></Button>

							<Button
								onClick={deleteOnClick}
								className="ml-auto"
								size="large"
								text="Slet"
								type="error"></Button>
							<Button
								onClick={modalOnOpen}
								className="ml-4"
								size="large"
								text="Ændre Status"
								type="warning"></Button>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default Order;
