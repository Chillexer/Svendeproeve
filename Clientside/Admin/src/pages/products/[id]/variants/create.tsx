import type { NextPage } from "next";
import axios, { AxiosError, AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import Button from "../../../../components/Button";
import Header from "../../../../components/Header";
import { useRouter } from "next/dist/client/router";
import InventorySizeDto from "../../../../models/InventorySizeDto";
import ColorPicker from "../../../../components/ColorPicker";
import CreateVariantDto from "../../../../models/CreateVariantDto";

const CreateVariant = () => {
	const [newVariant, setNewVariant] = useState<CreateVariantDto>({
		productId: -1,
		imagePath: "",
		discountPrice: 0,
		colorIds: [],
		inventoryInfos: [],
	});
	const [sizes, setSizes] = useState<InventorySizeDto[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	var router = useRouter();
	const { id } = router.query;

	const cancelOnClick = (e: React.MouseEvent) => {
		router.push(`/products/${id}`);
	};

	const inputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewVariant({ ...newVariant, [e.target.name]: e.target.value });
	};

	const discountPriceOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value);
		setNewVariant({ ...newVariant, discountPrice: value });
	};

	const setSelectedColors = (colors: number[]) => {
		setNewVariant({ ...newVariant, colorIds: colors });
	};

	const inventorySizeOnChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		size: InventorySizeDto
	): void => {
		const _sizes = [...sizes];

		var _size = _sizes.find((s) => s.id == size.id);
		if (!_size) return;

		_size.totalAmount = isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value);
		setSizes(_sizes);
	};

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setErrorMessage("");
		setIsLoading(true);
		var data: CreateVariantDto = {
			productId: newVariant.productId,
			colorIds: [...newVariant.colorIds],
			imagePath: newVariant.imagePath,
			discountPrice: newVariant.discountPrice,
			inventoryInfos: [...newVariant.inventoryInfos],
		};

		if (data.colorIds.length === 0) {
			setErrorMessage("Farver ikke valgt!!");
			setIsLoading(false);
			return;
		}

		if (!data.discountPrice || data.discountPrice <= 0) delete data.discountPrice;

		sizes.forEach((size) => {
			data.inventoryInfos.push({
				sizeId: size.id,
				totalAmount: size.totalAmount,
			});
		});

		data.productId = parseInt(id as string);

		axios
			.post("/api/admin/variants", data)
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
			.get<InventorySizeDto[]>(`/api/admin/sizes?productId=${id}`)
			.then((res) => {
				res.data.forEach((size) => {
					size.totalAmount = 0;
				});
				setSizes(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [id]);

	return (
		<div>
			<Header title="Opret variant"></Header>

			<div className="w-[700px] p-10 mx-auto bg-white rounded-lg">
				<form autoComplete="off" onSubmit={onSubmit}>
					<div className="grid grid-cols-2">
						<div className="flex flex-col mr-4 space-y-2">
							<div>
								<label htmlFor="imagePath" className="font-semibold">
									Billede Url
								</label>
								<input
									required
									value={newVariant.imagePath}
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
									value={newVariant.discountPrice}
									onChange={discountPriceOnChange}
									type="text"
									name="discountPrice"
									className="p-3  h-[40px] focus-visible:outline-none w-full border rounded-md"></input>
							</div>
							<div>
								<label htmlFor="sizeType" className="font-semibold">
									Farver
								</label>
								<ColorPicker onChange={setSelectedColors} />
							</div>
						</div>
						<div className="flex flex-col ml-4">
							<label htmlFor="price" className="font-semibold">
								Lagerbeholdning
							</label>
							<div className="overflow-hidden overflow-y-auto scrollbar-thin scrollbar scrollbar-thumb-black border rounded-md max-h-[200px]">
								{sizes &&
									sizes.map((size) => (
										<div
											key={size.id}
											className="flex items-center justify-between h-10 px-4 border-b last:border-none ">
											<p>{size.sizeName}</p>
											<input
												min="0"
												value={size.totalAmount}
												onChange={(e) => inventorySizeOnChange(e, size)}
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

export default CreateVariant;
