import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { BasketData } from "../../atoms/modalAtoms";
import Basket from "../../models/Basket";
import BasketItem from "../../models/BasketItem";
import styles from "./BasketCard.module.css";

interface Props {
	item: BasketItem;
}

function BasketCard({ item }: Props) {
	const [basketData, setBasketData] = useRecoilState(BasketData);
	const [orderedItemsTotal, setOrderedItemsTotal] = useState<number>();

	const updateBasket = (value: number) => {
		var updatedBasketData: Basket = JSON.parse(JSON.stringify(basketData));
		updatedBasketData.items.forEach((i) => {
			if (i.variant.id == item.variant.id && i.size.id == item.size.id) i.orderedItemsTotal = value;
		});

		setBasketData(updatedBasketData);
	};

	const removeFromBasket = () => {
		var updatedBasketData: Basket = JSON.parse(JSON.stringify(basketData));
		updatedBasketData.items = updatedBasketData.items.filter(
			(i) => !(i.variant.id == item.variant.id && i.size.id == item.size.id)
		);

		setBasketData(updatedBasketData);
	};

	const inputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let value = parseInt(e.target.value);

		if (!isNaN(value)) {
			setOrderedItemsTotal(value);
			if (value > 0) updateBasket(value);
		} else setOrderedItemsTotal(0);
	};

	const inputOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		if (orderedItemsTotal && orderedItemsTotal > 0) return;

		removeFromBasket();
	};

	const arrowsOnClick = (e: React.MouseEvent<SVGElement>, value: number) => {
		if (orderedItemsTotal && orderedItemsTotal + value == 0) removeFromBasket();
		else if (orderedItemsTotal) updateBasket(orderedItemsTotal + value);
	};

	useEffect(() => {
		setOrderedItemsTotal(item.orderedItemsTotal);
	}, [item]);

	if (item)
		return (
			<div className="grid grid-cols-3 p-3 space-x-3">
				<div>
					<Image src={item.variant.imagePath} height="100" width="100" alt="Produkt" />
				</div>
				<div className="">
					<p className="overflow-hidden whitespace-nowrap overflow-ellipsis">
						{item.variant.product.model}
					</p>
					{item.variant.discountPrice ? (
						<p className="space-x-2">
							<span className="text-red-400">{item.variant.discountPrice}DKK</span>
							<span className="line-through">{item.variant.product.price}DKK</span>
						</p>
					) : (
						<p>{item.variant.product.price}DKK</p>
					)}
					<p>{item.size.sizeName}</p>
				</div>
				<div className="flex">
					<svg
						onClick={(e) => arrowsOnClick(e, -1)}
						className="w-6 h-6 text-red-500 bg-white fill-current rounded-l-xl"
						viewBox="0 0 24 24">
						<path d="M17,13H7V11H17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
					</svg>
					<div>
						<input
							min="0"
							type="number"
							value={orderedItemsTotal}
							onBlur={inputOnBlur}
							onChange={inputOnChange}
							className={"w-10 text-center " + styles["orderedItemsTotal"]}
						/>
					</div>
					<svg
						onClick={(e) => arrowsOnClick(e, 1)}
						className="w-6 h-6 text-green-500 bg-white fill-current rounded-r-xl"
						viewBox="0 0 24 24">
						<path d="M17,13H13V17H11V13H7V11H11V7H13V11H17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
					</svg>
				</div>
			</div>
		);
	return <></>;
}

export default BasketCard;
