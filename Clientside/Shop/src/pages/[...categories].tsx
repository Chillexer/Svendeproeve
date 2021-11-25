import type { NextPage } from "next";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import axios from "axios";
import VariantDto from "../models/VariantDto";
import ProductList from "../components/ui/ProductList";
import NestedCategory from "../models/NestedCategory";
import ProductCategory from "../components/ProductCategory";
import { useRouter } from "next/dist/client/router";
import { SizeType } from "../models/Enums";
import SizeDto from "../models/SizeDto";

enum PriceInvervals {
	"0-200",
	"200-400",
	"400-600",
	"600-800",
	"800-1000",
	"1000<",
}

interface SearchParams {
	sizeType: SizeType | -1;
	sizeId: number;
	brand: string;
	priceInterval: PriceInvervals | -1;
}

const Home: NextPage = (props) => {
	const router = useRouter();
	const { categories } = router.query;
	const [categoryName, setCategoryName] = useState<string>();
	const [gender, setGender] = useState<string>();
	const [variants, setVariants] = useState<VariantDto[]>([]);
	const [category, setCategory] = useState<NestedCategory>();
	const [searchParams, setSearchParams] = useState<SearchParams>({
		sizeType: -1,
		brand: "",
		priceInterval: -1,
		sizeId: -1,
	});
	const [brands, setBrands] = useState<string[]>();
	const [sizes, setSizes] = useState<SizeDto[]>();
	const [loading, setLoading] = useState(false);

	const selectOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		if (!isNaN(parseInt(e.target.value)))
			setSearchParams({ ...searchParams, [e.target.name]: parseInt(e.target.value) });
		else setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
	};

	useEffect(() => {
		setLoading(true);
		let category;
		if (categories) {
			const gender = categories.at(0);
			if (gender) setGender(gender);

			if (categories && categories?.length > 1) {
				category = categories?.at(-1);
			}

			setCategoryName(category);

			if (gender) {
				axios
					.get<any>("/api/shop/categories", { params: { gender: gender } })
					.then((res) => {
						setCategory(res.data);
					})
					.catch((err) => console.log(err))
					.finally(() => {
						setLoading(false);
					});

				axios
					.get<string[]>("/api/shop/products/brands", {
						params: { gender: gender, category: category },
					})
					.then((res) => {
						setBrands(res.data);
					})
					.catch((err) => console.log(err));
			}
		}
	}, [categories]);

	useEffect(() => {
		let category;
		if (categories) {
			const gender = categories.at(0);
			if (gender) setGender(gender);

			if (categories && categories?.length > 1) {
				category = categories?.at(-1);
			}

			setCategoryName(category);
			let localParams: any = { ...searchParams };
			if (localParams.brand === "") delete localParams.brand;
			if (localParams.sizeType === -1) delete localParams.sizeType;
			if (localParams.priceInterval === -1) delete localParams.priceInterval;
			if (localParams.sizeId === -1) delete localParams.sizeId;

			if (localParams.priceInterval) {
				let priceinterval = localParams.priceInterval as number;
				let splits = PriceInvervals[priceinterval]?.split(new RegExp(/(<|-)/gm));
				if (splits) {
					localParams.priceFrom = splits.at(0);
					if (splits.length > 1 && splits.at(-1) !== "") localParams.priceTo = splits.at(-1);
					delete localParams.priceInterval;
				}
			}

			axios
				.get<VariantDto[]>("/api/shop/variants", {
					params: { gender: gender, category: category, ...localParams },
				})
				.then((res) => {
					setVariants(res.data);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}, [categories, searchParams]);

	useEffect(() => {
		if (searchParams.sizeType !== -1)
			axios
				.get<SizeDto[]>("/api/shop/sizes", { params: { sizeType: searchParams.sizeType } })
				.then((res) => {
					setSizes(res.data);
				})
				.catch((err) => console.log(err));
	}, [searchParams.sizeType]);

	return (
		<div className="flex flex-col md:flex-row">
			<div className="flex flex-col flex-1 md:flex-row sm:flex-none">
				<div className="mx-6 my-5">
					<div className="hidden space-x-6 md:space-x-0 md:flex md:flex-col md:w-52 md:pl-3">
						{gender && category && (
							<ProductCategory
								isMobile={false}
								gender={gender}
								categoryName={categoryName}
								category={category}
								isFirst={true}
							/>
						)}
					</div>
					<div className="flex flex-wrap gap-2 md:space-x-0 md:hidden md:flex-col md:w-52 md:pl-3">
						{gender && category && (
							<ProductCategory
								isMobile
								gender={gender}
								categoryName={categoryName}
								category={category}
								isFirst={true}
							/>
						)}
					</div>
				</div>
			</div>
			<div className="w-full">
				<h1 className="mx-6 my-3 text-lg lg:my-6">
					{variants.length > 0
						? gender &&
						  `Produkter til ${gender} ${categoryName ? `med kategorien ${categoryName}` : ""}`
						: "Ingen Produkter fundet"}
				</h1>
				<div className="px-6 mb-5 space-x-6 md:mt-5">
					<select
						onChange={selectOnChange}
						value={searchParams.sizeType}
						name="sizeType"
						className="border shadow-sm">
						<option value="-1">Størrelse type</option>
						<option value={SizeType.OneSize}>OneSize</option>
						<option value={SizeType.Shoes}>Sko</option>
						<option value={SizeType.Shirt}>Trøje</option>
						<option value={SizeType.Jackets}>Jakke</option>
						<option value={SizeType.Pants}>Bukser</option>
						<option value={SizeType.Shorts}>Shorts</option>
						<option value={SizeType.Belt}>Bælte</option>
					</select>
					{searchParams.sizeType !== -1 && sizes ? (
						<select
							onChange={selectOnChange}
							value={searchParams.sizeId}
							name="sizeId"
							className="border shadow-sm">
							<option value="-1">Størrelse</option>
							{sizes.map((s) => (
								<option key={s.id} value={s.id}>
									{s.sizeName}
								</option>
							))}
						</select>
					) : (
						<></>
					)}
					<select
						onChange={selectOnChange}
						value={searchParams.brand}
						name="brand"
						className="border shadow-sm">
						<option value="">Mærke</option>
						{brands &&
							brands.map((b) => (
								<option key={b} value={b}>
									{b}
								</option>
							))}
					</select>
					<select
						onChange={selectOnChange}
						value={searchParams.priceInterval}
						name="priceInterval"
						className="border shadow-sm">
						<option value="-1">Pris</option>
						<option value={PriceInvervals["0-200"]}>
							{PriceInvervals[PriceInvervals["0-200"]]}
						</option>
						<option value={PriceInvervals["200-400"]}>
							{PriceInvervals[PriceInvervals["200-400"]]}
						</option>
						<option value={PriceInvervals["400-600"]}>
							{PriceInvervals[PriceInvervals["400-600"]]}
						</option>
						<option value={PriceInvervals["600-800"]}>
							{PriceInvervals[PriceInvervals["600-800"]]}
						</option>
						<option value={PriceInvervals["800-1000"]}>
							{PriceInvervals[PriceInvervals["800-1000"]]}
						</option>
						<option value={PriceInvervals["1000<"]}>
							{PriceInvervals[PriceInvervals["1000<"]]}
						</option>
					</select>
				</div>
				{variants.length > 0 && (
					<div className="grid grid-cols-2 gap-3 p-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
						<ProductList variants={variants} />
					</div>
				)}
			</div>
		</div>
	);
};

export default Home;
