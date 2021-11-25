import axios from "axios";
import { useEffect, useState } from "react";
import VariantDto from "../models/VariantDto";
import PopularItemCard from "./ui/PopularItemCard";

function PopularItems() {
	const [variants, setVariants] = useState<VariantDto[]>();

	useEffect(() => {
		axios
			.get<VariantDto[]>("/api/shop/variants/top6")
			.then((res) => {
				setVariants(res.data);
			})
			.catch((err) => console.log(err));
	}, []);

	return (
		<div className="flex flex-col items-center px-4 py-6 lg:py-9 lg:px-20 mx-auto lg:w-[1000px]">
			<h1 className="pb-3 font-semibold lg:pb-7 sm:text-lg lg:text-3xl">Mest Populære</h1>
			<div className="grid grid-cols-3 gap-4 lg:grid-cols-6">
				{variants &&
					variants.map((variant) => <PopularItemCard variant={variant} key={variant.id} />)}
			</div>
		</div>
	);
}

export default PopularItems;
