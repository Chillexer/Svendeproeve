import type { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Search from "../../components/Search";
import InventoryList from "../../components/InventoryList";
import axios from "axios";
import BaseProductDto from "../../models/BaseProductDto";

const Inventory = () => {
	const [search, setSearch] = useState<string>("");
	const [currentSearch, setCurrentSearch] = useState<string>("");
	const [products, setProducts] = useState<BaseProductDto[]>([]);
	var router = useRouter();

	const SearchOnClick = (e: React.MouseEvent) => {
		setCurrentSearch(search);
	};

	const createOnClick = (e: React.MouseEvent) => {
		router.push("/products/create");
	};

	useEffect(() => {
		axios
			.get<BaseProductDto[]>(`/api/admin/products?search=${currentSearch}`)
			.then((res) => {
				setProducts(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [currentSearch]);

	return (
		<div className="grid h-screen" style={{ gridTemplateRows: "auto 1fr" }}>
			<Header
				title="Inventar"
				hasButton
				onClick={createOnClick}
				buttonText="Opret produkt"></Header>

			<div className="flex justify-between px-6 pb-10">
				{/* Search Area */}
				<div
					className="min-w-[250px] bg-white px-3 py-3 rounded-lg"
					style={{ height: "fit-content" }}>
					<Search
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						onSearch={SearchOnClick}></Search>
				</div>

				<div className="flex-grow h-full ml-6 bg-white rounded-lg">
					<InventoryList products={products}></InventoryList>
				</div>
			</div>
		</div>
	);
};

export default Inventory;
