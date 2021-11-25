import axios, { AxiosResponse } from "axios";
import Image from "next/image";
import { useRouter } from "next/dist/client/router";
import React, { useEffect, useState } from "react";
import Moment from "react-moment";
import Button from "../../../components/Button";
import Header from "../../../components/Header";
import { SizeType } from "../../../models/Enums";
import ProductDto from "../../../models/ProductDto";

const Product = () => {
	const [product, setProduct] = useState<ProductDto>();

	const router = useRouter();
	const { id } = router.query;

	const createOnClick = (e: React.MouseEvent) => {
		router.push(`/products/${id}/variants/create`);
	};

	const backOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		router.push("/products");
	};

	const deleteOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		axios
			.delete(`/api/admin/products/${product?.id}`)
			.then((res: AxiosResponse) => {
				router.push("/products");
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const deleteVariantOnClick = (e: React.MouseEvent<HTMLButtonElement>, variantId: number) => {
		axios
			.delete(`/api/admin/variants/${variantId}`)
			.then((res: AxiosResponse) => {
				if (product && product.variants) {
					const variants = product.variants.filter((v) => v.id !== variantId);
					const newProduct = { ...product, variants };

					setProduct(newProduct);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const editVariantOnClick = (e: React.MouseEvent<HTMLButtonElement>, variantId: number) => {
		router.push(`/products/${product?.id}/variants/${variantId}/edit`);
	};

	const editOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		router.push(`/products/${product?.id}/edit`);
	};

	useEffect(() => {
		axios
			.get<ProductDto>(`/api/admin/products/${id}`)
			.then((res) => {
				setProduct(res.data);
			})
			.catch((err) => {
				console.log(err);
				router.push("/products");
			});
	}, [id]);

	return (
		<div>
			<Header
				title="Vis produkt"
				hasButton
				buttonText="Opret variant"
				onClick={createOnClick}></Header>

			{product && (
				<div className="w-[700px] p-10 mx-auto bg-white rounded-lg">
					<div className="grid grid-cols-2 gap-2">
						<div className="flex space-x-1">
							<h2 className="font-medium">Mærke:</h2>
							<div>{product.brand}</div>
						</div>
						<div className="flex space-x-1">
							<h2 className="font-medium">Model:</h2>
							<div>{product.model}</div>
						</div>
						<div className="flex space-x-1">
							<h2 className="font-medium">Størrelse type:</h2>
							<div>{SizeType[product.sizeType]}</div>
						</div>
						<div className="flex space-x-1">
							<h2 className="font-medium">Pris:</h2>
							<div>{product.price.toFixed(2)} DKK</div>
						</div>
						<div className="flex space-x-1">
							<h2 className="font-medium">Køn:</h2>
							<div>{product.gender.genderName}</div>
						</div>
						<div className="flex space-x-1">
							<h2 className="font-medium">Sidst opdateret:</h2>
							<div>
								<Moment format="DD-MM-yyyy" date={product.updatedAt}></Moment>
							</div>
						</div>
						<div className="flex col-span-2 pb-2 space-x-1 border-b-2 border-gray-700">
							<h2 className="font-medium">Oprettet:</h2>
							<div>
								<Moment format="DD-MM-yyyy" date={product.createdAt}></Moment>
							</div>
						</div>
						<div className="col-span-2">
							<h2 className="text-lg font-medium">Kategorier</h2>
							<div className="flex flex-wrap gap-2 col-span-2 mt-1 min-h-[40px]">
								{product.categories &&
									product.categories.map((category) => (
										<div
											key={category.id}
											className="h-[30px] relative border w-max rounded-lg overflow-hidden px-3 flex items-center">
											<div>{`(${category.parentName}) ${category.name}`}</div>
										</div>
									))}
							</div>
						</div>
						<div className="flex flex-col col-span-2">
							<label htmlFor="description" className="text-lg font-medium">
								Beskrivelse
							</label>
							<p
								className="w-full mt-2 whitespace-pre-line border border-none rounded-md disabled:bg-white focus-visible:outline-none"
								draggable="false">
								{product.description}
							</p>
						</div>
						<div className="flex flex-col col-span-2">
							<label htmlFor="description" className="text-lg font-medium">
								Varianter
							</label>
							<div
								className="grid gap-3 mt-3 text-md"
								style={{ gridTemplateColumns: "repeat( auto-fill, minmax(150px, 1fr) )" }}>
								{!product.variants || product.variants.length === 0 ? (
									<div>Der er ingen varianter</div>
								) : (
									product.variants.map((v) => (
										<div key={v.id} className="flex flex-col p-4 border rounded-lg">
											{v.imagePath && (
												<Image
													className="w-full"
													layout="responsive"
													width="500"
													height="500"
													alt=""
													src={v.imagePath}
												/>
											)}

											{v.discountPrice ? (
												<div className="flex justify-between mt-2 text-sm">
													<div className="text-red-600">{`DKK${v.discountPrice}`}</div>
													<div
														style={{
															textDecorationLine: "line-through",
														}}>{`DKK${product.price}`}</div>
												</div>
											) : (
												<div className="mt-2 text-sm">
													<div>{`DKK${product.price}`}</div>
												</div>
											)}
											<div className="flex flex-wrap gap-2 mt-2 mb-4">
												{v.colors.map((c) => {
													return c.hexValue ? (
														<div
															key={c.id}
															className="w-5 h-5 border"
															style={{
																background: c.hexValue,
																borderColor:
																	c.hexValue.toLowerCase() == "#ffffff" ? "black" : c.hexValue,
															}}></div>
													) : (
														<div key={c.id} className="flex flex-wrap w-5 h-5 rounded-full">
															<div className="bg-[#ffdd33] w-[10px] h-[10px]"></div>
															<div className="bg-[#5ad36c] w-[10px] h-[10px]"></div>
															<div className="bg-[#f563b9] w-[10px] h-[10px]"></div>
															<div className="bg-[#0f73ad] w-[10px] h-[10px]"></div>
														</div>
													);
												})}
											</div>
											<div className="flex justify-between mt-auto">
												<Button
													size="xsmall"
													text="Slet"
													type="error"
													onClick={(e) => deleteVariantOnClick(e, v.id)}></Button>
												<Button
													size="xsmall"
													text="Rediger"
													type="warning"
													onClick={(e) => editVariantOnClick(e, v.id)}></Button>
											</div>
										</div>
									))
								)}
							</div>
						</div>
					</div>

					<div className="flex col-span-2 mt-6">
						<Button onClick={backOnClick} size="large" text="Tilbage" type="secondary"></Button>

						<Button
							onClick={deleteOnClick}
							className="ml-auto"
							size="large"
							text="Slet"
							type="error"></Button>
						<Button
							onClick={editOnClick}
							className="ml-4"
							size="large"
							text="Rediger"
							type="warning"></Button>
					</div>
				</div>
			)}
		</div>
	);
};

export default Product;
