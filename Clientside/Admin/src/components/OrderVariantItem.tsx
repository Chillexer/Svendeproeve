import React, { ReactElement, useEffect, useState } from "react";
import VariantPicker from "./VariantPicker";
import VariantDto from "../models/VariantDto";
import CreateVariantOrderDto from "../models/CreateVariantOrderDto";
import { MinusIcon, PlusIcon } from "@heroicons/react/solid";

interface Props {
	variant?: CreateVariantOrderDto;
	onChange?: (variant: CreateVariantOrderDto) => void;
	addOnClick?: (variant: CreateVariantOrderDto) => void;
	deleteOnClick?: () => void;
	isBlue?: boolean;
}

function OrderVariantItem({
	variant,
	onChange,
	addOnClick,
	deleteOnClick,
	isBlue,
}: Props): ReactElement {
	const [variantOrder, setVariantOrder] = useState<CreateVariantOrderDto>({
		orderedItemsTotal: 0,
		sizeId: 0,
		variantId: 0,
		inventoryInfos: [],
	});
	const [clearState, setClearState] = useState<number>(Date.now());

	const setSelected = (variant: VariantDto) => {
		setVariantOrder({
			variantId: variant.id,
			sizeId: variant.inventoryInfos[0].size.id,
			orderedItemsTotal: 0,
			inventoryInfos: variant.inventoryInfos,
			product: variant.product,
		});
	};

	const onAdd = () => {
		if (addOnClick) addOnClick(variantOrder);
		setVariantOrder({
			orderedItemsTotal: 0,
			sizeId: 0,
			variantId: 0,
			inventoryInfos: [],
		});
		setClearState(Date.now());
	};

	const onDelete = () => {
		if (deleteOnClick) deleteOnClick();
	};

	const inputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (isNaN(parseInt(e.target.value))) e.target.value = "0";

		setVariantOrder({ ...variantOrder, [e.target.name]: parseInt(e.target.value) });
	};

	const selectOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setVariantOrder({ ...variantOrder, [e.target.name]: parseInt(e.target.value) });
	};

	useEffect(() => {
		if (variant && variant.inventoryInfos && variant.inventoryInfos[0]) {
			setVariantOrder(variant);
		}
	}, [variant]);

	useEffect(() => {
		if (!isBlue && onChange) onChange(variantOrder);
	}, [variantOrder, isBlue]);

	if (isBlue || variant)
		return (
			<>
				<label htmlFor="model" className="font-semibold">
					Model
				</label>
				<label htmlFor="orderedItemsTotal" className="font-semibold">
					Antal
				</label>
				<label htmlFor="sizeId" className="col-span-2 font-semibold">
					Størrelse
				</label>

				<div className="flex flex-col mb-2 mr-4">
					{isBlue ? (
						<VariantPicker onSelect={setSelected} reset={clearState}></VariantPicker>
					) : (
						<div className="p-3 text-sm flex items-center h-[40px] bg-gray-200 focus-visible:outline-none w-full border rounded-md">
							{variantOrder.product?.model}
						</div>
					)}
				</div>
				<div className="flex flex-col mb-2 mr-4">
					<input
						value={variantOrder.orderedItemsTotal}
						onChange={inputOnChange}
						type="text"
						name="orderedItemsTotal"
						className="p-3  h-[40px] focus-visible:outline-none w-full border rounded-md"></input>
				</div>
				<div className="flex flex-col mb-2 mr-4">
					<select
						value={variantOrder.sizeId}
						onChange={selectOnChange}
						name="sizeId"
						className="p-3 py-0  h-[40px] focus-visible:outline-none w-full border rounded-md">
						{variantOrder.inventoryInfos?.map((i) => (
							<option key={i.size.id} value={i.size.id}>
								{i.size.sizeName}
							</option>
						))}
					</select>
				</div>
				<div className="flex items-center mb-2">
					<button
						type="button"
						onClick={isBlue ? onAdd : onDelete}
						disabled={variantOrder == undefined}
						className={
							"text-white rounded-3xl disabled:opacity-50 disabled:cursor-not-allowed px-3 h-[40px]" +
							(isBlue ? " bg-sky-400" : " bg-red-500")
						}>
						{isBlue ? <PlusIcon className="w-6 h-6" /> : <MinusIcon className="w-6 h-6" />}
					</button>
				</div>
			</>
		);
	return <></>;
}

export default OrderVariantItem;
