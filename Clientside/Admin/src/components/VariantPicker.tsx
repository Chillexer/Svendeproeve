import { XIcon } from "@heroicons/react/solid";
import axios, { AxiosResponse } from "axios";
import { debounce } from "lodash";
import React, { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import VariantDto from "../models/VariantDto";
import ColorSquare from "./ColorSquare";
interface Props {
	onSelect: (variant: VariantDto) => void;
	reset?: number;
}

function VariantPicker({ onSelect, reset }: Props): ReactElement {
	const [isOpen, setIsOpen] = useState(false);
	const [variants, setVariants] = useState<VariantDto[]>([]);
	const [selectedVariant, setSelectedVariant] = useState<VariantDto>();
	const [search, setSearch] = useState("");
	const picker = useRef<HTMLDivElement>(null);

	const onMouseDown = (e: MouseEvent) => {
		if (picker && !picker.current?.contains(e.target as Node)) {
			document.removeEventListener("mousedown", onMouseDown);
			setIsOpen(false);
		}
	};

	const variantOnClick = (e: React.MouseEvent<HTMLDivElement>, variant: VariantDto) => {
		setIsOpen(false);
		document.removeEventListener("mousedown", onMouseDown);
		setSelectedVariant(variant);
	};

	const openPicker = (): void => {
		if (!isOpen) {
			document.addEventListener("mousedown", onMouseDown);
			setIsOpen(true);
		}
	};

	const resetOnClick = (e: React.MouseEvent<SVGSVGElement>) => {
		setSelectedVariant(undefined);
		openPicker();
	};

	const inputOnClick = (e: React.MouseEvent<HTMLInputElement>) => {
		openPicker();
	};

	const fetchVariantss = (url: string, cb: (res: AxiosResponse<VariantDto[], any>) => void) => {
		axios
			.get<VariantDto[]>(url)
			.then((res) => {
				cb(res);
			})
			.catch((err) => console.log(err));
	};

	const debouncedFetchVariants = useCallback(
		debounce((search: string, url: string, cb: (res: AxiosResponse<VariantDto[], any>) => void) => {
			if (search.trim() === "") setVariants([]);
			else fetchVariantss(url, cb);
		}, 250),
		[]
	);

	useEffect(() => {
		debouncedFetchVariants(search, `/api/admin/variants/search?search=${search}`, (res) => {
			setVariants(res.data);
			if (res.data.length > 0) openPicker();
			else if (isOpen) {
				document.removeEventListener("mousedown", onMouseDown);
				setIsOpen(false);
			}
		});
	}, [search]);

	useEffect(() => {
		if (selectedVariant) onSelect(selectedVariant);
	}, [selectedVariant]);

	useEffect(() => {
		if (isOpen) {
			document.removeEventListener("mousedown", onMouseDown);
			setIsOpen(false);
		}
		setVariants([]);
		setSelectedVariant(undefined);
		setSearch("");
	}, [reset]);

	return (
		<div className="relative" ref={picker}>
			{selectedVariant ? (
				<div
					className={
						"p-3 h-[40px] focus-visible:outline-none w-full border rounded-md bg-gray-200 flex items-center justify-between" +
						(isOpen ? " rounded-b-none" : "")
					}>
					<p className="text-sm">{selectedVariant.product.model}</p>
					<XIcon onClick={resetOnClick} className="w-6 h-6 cursor-pointer" />
				</div>
			) : (
				<input
					onClick={inputOnClick}
					className={
						"p-3 h-[40px] focus-visible:outline-none w-full border rounded-md flex items-center justify-between" +
						(isOpen ? " rounded-b-none" : "")
					}
					value={search}
					placeholder="Søg..."
					onChange={(e) => setSearch(e.target.value)}></input>
			)}

			<div
				className={
					"border border-t-0 absolute left-0 right-0 z-10 bg-white max-h-[200px] scrollbar scrollbar-thin scrollbar-thumb-black overflow-y-auto" +
					(isOpen && variants.length > 0 ? "" : " hidden")
				}>
				{variants &&
					variants.map((variant) => (
						<div
							className="flex w-full px-3 border-b"
							onClick={(e) => variantOnClick(e, variant)}
							key={variant.id}>
							<div className="flex items-center mr-2">
								<ColorSquare
									hexValue={variant.colors[0] && variant.colors[0].hexValue}></ColorSquare>
							</div>

							<div className="flex flex-col">
								<div>
									<p className="text-xs text-gray-700">{`${variant.product.brand}`}</p>
								</div>
								<div className="text-xs font-bold">
									<p>{`${variant.product.model}`}</p>
								</div>
							</div>
						</div>
					))}
			</div>
		</div>
	);
}

export default VariantPicker;
