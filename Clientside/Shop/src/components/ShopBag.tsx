import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { bagState, BasketData } from "../atoms/modalAtoms";
import Basket from "../models/Basket";
import BasketCard from "./ui/BasketCard";

function ShopBag() {
	const [showBag, setShowBag] = useRecoilState<boolean>(bagState);
	const basketData = useRecoilValue<Basket>(BasketData);
	const router = useRouter();

	useEffect(() => {
		if (basketData.items.length == 0) setShowBag(false);
	}, [basketData, setShowBag]);

	useEffect(() => {
		if (router.pathname == "/basket") setShowBag(false);
	}, [router, setShowBag]);

	return (
		<div
			className={`${
				showBag ? "" : "hidden"
			} absolute right-0 bottom-0 top-0 w-full sm:w-[400px] z-40`}>
			<div className="flex flex-col h-full max-h-[calc(100vh-80px)] sm:max-h-[calc(80vh-80px)] bg-gray-200">
				<h1 className="my-3 text-center">Shopping Bag</h1>
				<div className="flex-1 overflow-auto">
					{basketData.items.map((item, index) => (
						<BasketCard item={item} key={index} />
					))}
				</div>
				<div className="flex justify-center text-white bg-black">
					<Link href="/basket">
						<a className="px-6 py-2 rounded-xl">Gå til bestilling</a>
					</Link>
				</div>
			</div>
		</div>
	);
}

export default ShopBag;
