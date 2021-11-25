import type { NextPage } from "next";
import axios, { AxiosError, AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import Button from "../../../../../components/Button";
import Header from "../../../../../components/Header";
import { useRouter } from "next/dist/client/router";
import ColorPicker from "../../../../../components/ColorPicker";
import CreateVariantDto from "../../../../../models/CreateVariantDto";
import VariantDto from "../../../../../models/VariantDto";
import CreateVariantInventoryInfoDto from "../../../../../models/CreateVariantInventoryInfoDto";
import InventoryInfoDto from "../../../../../models/InventoryInfoDto";

const EditVariant = () => {
	const [variant, setVariant] = useState<VariantDto>();
	const [colors, setColors] = useState<number[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	var router = useRouter();
	const { id, variantId } = router.query;

	const cancelOnClick = (e: React.MouseEvent) => {
		router.push(`/products/${id}`);
	};

	const inputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (variant) setVariant({ ...variant, [e.target.name]: e.target.value });
	};

	const discountPriceOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value);
		if (variant) setVariant({ ...variant, discountPrice: value });
	};

	const setSelectedColors = (colors: number[]) => {
		setColors(colors);
	};

	const inventorySizeOnChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		x: InventoryInfoDto
	): void => {
		if (!variant || !variant.inventoryInfos) return;

		const _sizes = [...variant?.inventoryInfos];

		var _size = _sizes.find((s) => s.size.id == x.size.id);
		if (!_size) return;

		_size.totalAmount = isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value);
		setVariant({ ...variant, inventoryInfos: _sizes });
	};

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setErrorMessage("");
		setIsLoading(true);
		if (!variant) return;

		const inventoryInfos: CreateVariantInventoryInfoDto[] = [];
		const colorIds = colors;

		variant.inventoryInfos.forEach((element) => {
			inventoryInfos.push({ sizeId: element.size.id, totalAmount: element.totalAmount });
		});

		const data: CreateVariantDto = {
			imagePath: variant.imagePath,
			productId: variant.productId,
			inventoryInfos,
			discountPrice: variant.discountPrice,
			colorIds,
		};

		if (data.colorIds.length === 0) {
			setErrorMessage("Farver ikke valgt!!");
			setIsLoading(false);
			return;
		}

		if (!data.discountPrice || data.discountPrice <= 0) delete data.discountPrice;

		data.productId = parseInt(id as string);

		axios
			.put(`/api/admin/variants/${variantId}`, data)
			.then((res: AxiosResponse) => {
				if (res.status === 201) router.push(`/products/${id}`);
			})
			.catch((err: AxiosError) => {
				console.log(err);
				if (err.response?.status === 400) setErrorMessage(err.response.data.errorMessage);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	useEffect(() => {
		axios
			.get<VariantDto>(`/api/admin/variants/${variantId}`)
			.then((res) => {
				res.data.discountPrice = res.data.discountPrice ?? 0;
				setVariant(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [variantId]);

	return (
		<div>
			<Header title="Rediger variant"></Header>

			<div className="w-[700px] p-10 mx-auto bg-white rounded-lg">
				{variant && (
					<form autoComplete="off" onSubmit={onSubmit}>
						<div className="grid grid-cols-2">
							<div className="flex flex-col mr-4 space-y-2">
								<div>
									<label htmlFor="imagePath" className="font-semibold">
										Billede Url
									</label>
									<input
										required
										value={variant.imagePath}
										onChange={inputOnChange}
										type="text"
										name="imagePath"
										className="p-3  h-[40px] focus-visible:outline-none w-full border rounded-md"></input>
								</div>
								<div>
									<label htmlFor="discountPrice" className="font-semibold">
										Discount pris
									</label>
									<input
										required
										value={variant.discountPrice}
										onChange={discountPriceOnChange}
										type="text"
										name="discountPrice"
										className="p-3  h-[40px] focus-visible:outline-none w-full border rounded-md"></input>
								</div>
								<div>
									<label htmlFor="sizeType" className="font-semibold">
										Farver
									</label>
									<ColorPicker onChange={setSelectedColors} selectedColors={variant.colors} />
								</div>
							</div>
							<div className="flex flex-col ml-4">
								<label htmlFor="price" className="font-semibold">
									Lagerbeholdning
								</label>
								<div className="overflow-hidden overflow-y-auto scrollbar-thin scrollbar scrollbar-thumb-black border rounded-md max-h-[200px]">
									{variant.inventoryInfos.map((x) => (
										<div
											key={x.size.id}
											className="flex items-center justify-between h-10 px-4 border-b last:border-none ">
											<p>{x.size.sizeName}</p>
											<input
												min="0"
												value={x.totalAmount}
												onChange={(e) => inventorySizeOnChange(e, x)}
												className="w-24 py-1 text-sm text-center border rounded-lg"
												type="number"></input>
										</div>
									))}
								</div>
							</div>
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
								text="Gem"
								buttonType="submit"
								type="success"
								className="mt-8"></Button>
						</div>
					</form>
				)}
			</div>
		</div>
	);
};

export default EditVariant;
