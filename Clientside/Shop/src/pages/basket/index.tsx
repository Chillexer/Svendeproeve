import type { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { BasketData } from "../../atoms/modalAtoms";
import OrderItemCard from "../../components/ui/OrderItemCard";
import OrderList from "../../components/ui/OrderList";
import FormatPrice from "../../helpers/FormatPrice";

const Order: NextPage = (props) => {
	const basketData = useRecoilValue(BasketData);
	const router = useRouter();

	useEffect(() => {
		if (basketData && basketData.items.length == 0) router.push("/");
	}, [router, basketData]);

	return (
		<div className="w-full p-3 mx-auto lg:w-[1000px]">
			<div className="flex flex-col justify-center w-full mx-auto mt-3 border">
				<div className="w-full p-3 bg-gray-900">
					<h1 className="text-white">Basket</h1>
				</div>
				<div className="grid grid-cols-1 gap-3 p-3 md:grid-cols-2">
					<div className="space-y-3">
						{basketData.items.map((item, index) => (
							<OrderItemCard key={index} item={item} />
						))}
					</div>
					<div>
						<OrderList />
						<Link href="/order">
							<a className="inline-block w-full p-3 mt-3 text-white bg-black">Gå til bestilling</a>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Order;
