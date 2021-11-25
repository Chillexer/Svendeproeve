import React, { ReactElement } from "react";
import Image from "next/image";
import BasketItem from "../../models/BasketItem";
import FormatPrice from "../../helpers/FormatPrice";
import Link from "next/link";

interface Props {
	item: BasketItem;
}

function OrderReadOnlyItemCard({ item }: Props): ReactElement {
	return (
		<div className="flex pr-2 border">
			<div className="pr-3 min-w-[9rem]">
				<Image
					layout="responsive"
					src={item.variant.imagePath}
					height="130"
					width="130"
					alt="Produkt"
				/>
			</div>
			<div className="grid w-full grid-cols-2 gap-2 py-2">
				<div className="">
					<Link
						href={`/products/${
							encodeURIComponent(item.variant.product.model) + "-" + item.variant.productId
						}/${item.variant.id}`}>
						<a className="hover:underline">
							<p className="">{item.variant.product.brand}</p>
							<p className="">{item.variant.product.model}</p>
						</a>
					</Link>
					<p className="">{item.variant.colors.at(0)?.colorName}</p>
					<p className="">Størrelse: {item.size.sizeName}</p>
				</div>
				<div className="">
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
					<p>Antal: {item.orderedItemsTotal}</p>
					<p>
						Total:{" "}
						{FormatPrice(
							item.orderedItemsTotal * (item.variant.discountPrice ?? item.variant.product.price)
						)}{" "}
						DKK
					</p>
				</div>
			</div>
		</div>
	);
}

export default OrderReadOnlyItemCard;
