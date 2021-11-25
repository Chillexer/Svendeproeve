import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { BasketData } from "../../atoms/modalAtoms";
import FormatPrice from "../../helpers/FormatPrice";
import Basket from "../../models/Basket";
import BasketItem from "../../models/BasketItem";

interface Props {
	item: BasketItem;
}

function OrderItemCard({ item }: Props) {
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

	useEffect(() => {
		setOrderedItemsTotal(item.orderedItemsTotal);
	}, [item.orderedItemsTotal]);

	return (
		<div className="flex gap-2 pr-2 border">
			<div className="relative w-36 min-w-[9rem]">
				<Image
					layout="responsive"
					src={item.variant.imagePath}
					height="130"
					width="130"
					alt="Produkt"
				/>
			</div>
			<div className="flex flex-col w-full">
				<div className="flex justify-between">
					<div className="overflow-hidden">
						<Link
							href={`/products/${
								encodeURIComponent(item.variant.product.model) + "-" + item.variant.productId
							}/${item.variant.id}`}>
							<a className="hover:underline">
								<p>{item.variant.product.brand}</p>
								<p className="">{item.variant.product.model}</p>
								{item.variant.colors && item.variant.colors.length > 0 && (
									<p>{item.variant.colors.at(0)?.colorName}</p>
								)}
							</a>
						</Link>
					</div>
					<div className="flex flex-col whitespace-nowrap">
						<div onClick={removeFromBasket} className="ml-auto cursor-pointer select-none">
							x
						</div>
						{item.variant.discountPrice ? (
							<>
								<p className="text-red-400">
									{FormatPrice(item.variant.discountPrice * item.orderedItemsTotal)} DKK
								</p>
								<p className="line-through">
									{FormatPrice(item.variant.product.price * item.orderedItemsTotal)} DKK
								</p>
							</>
						) : (
							<p>{FormatPrice(item.variant.product.price * item.orderedItemsTotal)} DKK</p>
						)}
					</div>
				</div>
				<div>
					<p>Størrelse: {item.size.sizeName}</p>
					<input
						value={orderedItemsTotal}
						onChange={inputOnChange}
						onBlur={inputOnBlur}
						className="w-20 h-8 text-center border-2 border-gray-400 focus:border-black"
					/>
				</div>
			</div>
		</div>
	);
}

export default OrderItemCard;
