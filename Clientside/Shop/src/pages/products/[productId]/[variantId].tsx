import type { NextPage } from "next";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/dist/client/router";
import axios, { AxiosError } from "axios";
import ProductWithVariantsDto from "../../../models/ProductWithVariantsDto";
import VariantWithoutProductDto from "../../../models/VariantWithoutProductDto";
import { useRecoilState } from "recoil";
import { BasketData } from "../../../atoms/modalAtoms";
import VariantDto from "../../../models/VariantDto";
import BasketVariant from "../../../models/BasketVariant";

const Variant: NextPage = () => {
	const [product, setProduct] = useState<ProductWithVariantsDto>();
	const [variant, setVariant] = useState<VariantWithoutProductDto>();
	const [message, setmessage] = useState("");
	const [selectedSize, setSelectedSize] = useState<number>(-1);
	const [isLoading, setIsLoading] = useState(true);
	const [basket, setBasket] = useRecoilState(BasketData);

	const router = useRouter();
	const { productId, variantId } = router.query;

	const selectImage = (e: React.MouseEvent<HTMLImageElement>, id: number) => {
		if (variant && product) {
			var path = `/products/${encodeURIComponent(product?.model)}-${product.id}/${id}`;
			router.push(path);
		}
	};

	const sizeSelectOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedSize(parseInt(e.target.value));
	};

	const addOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		setmessage("");
		if (!variant || !product || selectedSize === -1) {
			if (selectedSize === -1) setmessage("Størrelse ikke valgt");
			return;
		}

		let updatedBasket = { ...basket };
		let items = [...updatedBasket.items];
		let item = items.findIndex((i) => i.variant.id == variant?.id && i.size.id == selectedSize);

		var size = variant.inventoryInfos.filter((ii) => ii.size.id == selectedSize).at(0)?.size;
		if (!size) return;
		var newVariant: BasketVariant = { ...variant, product: product };

		if (item == -1) {
			items.push({ orderedItemsTotal: 1, size, variant: newVariant });
		} else {
			let editedItem = { ...items[item] };
			editedItem.orderedItemsTotal++;
			items[item] = editedItem;
		}

		updatedBasket.items = items;

		setSelectedSize(-1);
		setBasket(updatedBasket);

		setmessage("Produkt tilføjet til kurv");
	};

	useEffect(() => {
		var id = productId?.toString().split("-").at(-1);
		if (id && !isNaN(parseInt(id))) {
			setIsLoading(true);
			axios
				.get<ProductWithVariantsDto>(`/api/shop/products/${id}`)
				.then((res) => {
					setProduct(res.data);
				})
				.catch((err: AxiosError) => {
					if (err.code == "404") router.push("/");
					else console.log(err);
				})
				.finally(() => {
					setIsLoading(false);
				});
		} else if (!isLoading) {
			router.push("/");
		}
	}, [productId]);

	useEffect(() => {
		if (variantId && !isNaN(parseInt(variantId.toString())) && product) {
			var variants = product.variants?.filter((v) => v.id == parseInt(variantId.toString()));
			if (variants && variants?.length > 0) setVariant(variants.at(0));
			else if (!isLoading) {
				router.push("/");
			}
		}
	}, [variantId, product]);

	if (product && variant)
		return (
			<div className="md:flex md:justify-center md:h-full md:p-10 ">
				<div className="w-full md:w-3/5 md:max-w-2xl">
					<Image
						priority
						layout="responsive"
						src={variant?.imagePath!}
						height="500"
						width="500"
						alt="Product"
					/>
				</div>
				<div className="flex flex-col p-5 py-10 ml-6 space-y-6 md:w-2/5">
					<p>{product?.brand}</p>
					<p>{product?.model}</p>
					{variant?.discountPrice ? (
						<p className="space-x-2">
							<span className="text-red-400">{variant?.discountPrice}DKK</span>
							<span className="line-through">{product?.price}DKK</span>
						</p>
					) : (
						<p>{product?.price}DKK</p>
					)}

					<p>{product?.description}</p>
					<p>Variant</p>
					<div className="flex flex-wrap gap-2">
						{product &&
							product.variants?.map((v) => {
								return (
									<div key={v.id}>
										<div
											className={"w-24 " + (v.id == variant?.id ? " border-2 border-black" : "")}>
											<Image
												layout="responsive"
												src={v.imagePath}
												height="100"
												width="100"
												alt="Product"
												onClick={(e) => selectImage(e, v.id)}
											/>
										</div>
										<div className="text-center">{v.colors.at(0)?.colorName}</div>
									</div>
								);
							})}
					</div>
					<div className="flex flex-col w-64">
						<select value={selectedSize} onChange={sizeSelectOnChange} className="border shadow-sm">
							<option value="-1" disabled hidden>
								Størrelse
							</option>
							{variant.inventoryInfos.map((info) => {
								return (
									<option key={info.size.id} disabled={info.totalAmount <= 0} value={info.size.id}>
										{info.size.sizeName}
									</option>
								);
							})}
						</select>
						<button onClick={addOnClick} className="text-white bg-black">
							Læg i kurv
						</button>
						<div className="mt-2">{message}</div>
					</div>
				</div>
			</div>
		);
	return <div>Loading...</div>;
};

export default Variant;
