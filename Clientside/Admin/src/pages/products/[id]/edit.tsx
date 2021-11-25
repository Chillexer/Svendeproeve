import type { NextPage } from "next";
import axios, { AxiosError, AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import Button from "../../../components/Button";
import Header from "../../../components/Header";
import { useRouter } from "next/dist/client/router";
import SearchCategoryDto from "../../../models/SearchCategoryDto";
import GenreAndCategoriesInput from "../../../components/GenreAndCategoriesInput";
import { SizeType } from "../../../models/Enums";
import ProductDto from "../../../models/ProductDto";
import { UpdateProductDto } from "../../../models/UpdateProductDto";

const EditProduct = () => {
	const [product, setProduct] = useState<any>({
		brand: "",
		model: "",
		description: "",
		genderId: 0,
		price: "",
		sizeType: SizeType.OneSize,
		categoryIds: [],
	});
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [selectedCategories, setSelectedCategories] = useState<SearchCategoryDto[]>([]);

	var router = useRouter();
	const { id } = router.query;

	useEffect(() => {
		axios
			.get<ProductDto>(`/api/admin/products/${id}`)
			.then((res) => {
				const data: any = { ...res.data };
				delete data.categories;
				setProduct({ ...data });
				setSelectedCategories(res.data.categories);
			})
			.catch((err) => {
				console.log(err);
				router.push("/products");
			});
	}, [id, router]);

	const cancelOnClick = (e: React.MouseEvent) => {
		router.push(`/products/${id}`);
	};

	const inputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setProduct({ ...product, [e.target.name]: e.target.value });
	};

	const textAreaOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setProduct({ ...product, [e.target.name]: e.target.value });
	};

	const selectOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setProduct({ ...product, [e.target.name]: parseInt(e.target.value) });
	};

	const genreAndCategoriesOnChange = (
		selectedCategories: SearchCategoryDto[],
		genderId: number
	) => {
		setSelectedCategories(selectedCategories);
		setProduct({ ...product, genderId });
	};

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		var data: UpdateProductDto = { ...product };
		data.categoryIds = [];
		selectedCategories.forEach((c) => {
			data.categoryIds.push(c.id);
		});

		if (data.categoryIds.length === 0) {
			setErrorMessage("Kategorier ikke valgt!!");
			setIsLoading(false);
			return;
		}

		axios
			.put(`/api/admin/products/${id}`, data)
			.then((res: AxiosResponse) => {
				if (res.status === 200) router.push(`/products/${id}`);
			})
			.catch((err: AxiosError) => {
				console.log(err);
				if (err.response?.status === 400) setErrorMessage(err.response.data.errorMessage);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	return (
		<div>
			<Header title="Rediger produkt"></Header>

			{product && (
				<div className="w-[700px] p-10 mx-auto bg-white rounded-lg">
					<form autoComplete="off" onSubmit={onSubmit}>
						<div className="grid grid-cols-2">
							<div className="flex flex-col mr-4">
								<label htmlFor="brand" className="font-semibold">
									Mærke
								</label>
								<input
									required
									value={product.brand}
									onChange={inputOnChange}
									type="text"
									name="brand"
									className="p-3  h-[40px] focus-visible:outline-none w-full border rounded-md"></input>
							</div>
							<div className="flex flex-col ml-4">
								<label htmlFor="model" className="font-semibold">
									Model
								</label>
								<input
									required
									value={product.model}
									onChange={inputOnChange}
									type="text"
									name="model"
									className="p-3  h-[40px] focus-visible:outline-none w-full border rounded-md"></input>
							</div>
							<div className="flex flex-col mt-4 mr-4">
								<label htmlFor="sizeType" className="font-semibold">
									Størrelse type
								</label>
								<select
									required
									disabled
									value={product.sizeType}
									onChange={selectOnChange}
									name="sizeType"
									className="p-3 py-0  h-[40px] focus-visible:outline-none w-full border rounded-md">
									<option value={SizeType.OneSize}>OneSize</option>
									<option value={SizeType.Shoes}>Sko</option>
									<option value={SizeType.Shirt}>Trøje</option>
									<option value={SizeType.Jackets}>Jakke</option>
									<option value={SizeType.Pants}>Bukser</option>
									<option value={SizeType.Shorts}>Shorts</option>
									<option value={SizeType.Belt}>Bælte</option>
								</select>
							</div>
							<div className="flex flex-col mt-4 ml-4">
								<label htmlFor="price" className="font-semibold">
									Pris
								</label>
								<input
									type="number"
									value={product.price}
									onChange={inputOnChange}
									name="price"
									className="p-3 h-[40px] focus-visible:outline-none w-full border rounded-md"></input>
							</div>
							<GenreAndCategoriesInput
								onChange={genreAndCategoriesOnChange}
								selectedCategories={selectedCategories}
								genderId={product.genderId}
							/>
							<div className="flex flex-col col-span-2 mt-4">
								<label htmlFor="description" className="font-semibold">
									Beskrivelse
								</label>
								<textarea
									value={product.description}
									onChange={textAreaOnChange}
									name="description"
									className="w-full h-48 p-3 border rounded-md focus-visible:outline-none"
								/>
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
				</div>
			)}
		</div>
	);
};

export default EditProduct;
