import { useRecoilValue } from "recoil";
import { BasketData } from "../../atoms/modalAtoms";
import FormatPrice from "../../helpers/FormatPrice";

function OrderList() {
	const basketData = useRecoilValue(BasketData);

	const getTotalPrice = (): number => {
		let price = 0;
		basketData.items.forEach((item) => {
			price += item.variant.product.price * item.orderedItemsTotal;
		});
		return price;
	};

	const getDiscount = (): number => {
		let price = 0;
		basketData.items.forEach((item) => {
			if (item.variant.discountPrice)
				price += (item.variant.product.price - item.variant.discountPrice) * item.orderedItemsTotal;
		});
		return price;
	};

	const getProductCount = (): number => {
		let counter = 0;
		basketData.items.forEach((item) => {
			counter += item.orderedItemsTotal;
		});
		return counter;
	};

	return (
		<div className="flex flex-col p-3 space-y-8 border">
			<div>
				<p>Ordreliste</p>
			</div>
			<div className="flex justify-between">
				<div>
					<p>{getProductCount()} Produkter</p>
					{getDiscount() > 0 && <p>Rabat</p>}
					<p>Levering</p>
				</div>
				<div>
					<div className="flex justify-between space-x-2">
						<p>{FormatPrice(getTotalPrice())}</p>
						<p>DKK</p>
					</div>
					{getDiscount() > 0 && (
						<div className="flex justify-between space-x-2 text-red-400">
							<p>{FormatPrice(getDiscount())}</p>
							<p>DKK</p>
						</div>
					)}
					<p className="text-right uppercase">gratis</p>
				</div>
			</div>
			<div className="flex justify-between">
				<div>
					<p className="">Total</p>
				</div>
				<div>
					<p>{FormatPrice(getTotalPrice() - getDiscount())} DKK</p>
				</div>
			</div>
		</div>
	);
}

export default OrderList;
