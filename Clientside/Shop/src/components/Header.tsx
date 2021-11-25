import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import MenuClosedIcon from "./svgs/MenuClosedIcon";
import SearchIcon from "./svgs/SearchIcon";
import SupportIcon from "./svgs/SupportIcon";
import UserIcon from "./svgs/UserIcon";
import ShopBagIcon from "./svgs/ShopBagIcon";
import { useRecoilState, useRecoilValue } from "recoil";
import { menuState, bagState, searchState, BasketData, searchProducts } from "../atoms/modalAtoms";
import CloseIcon from "./svgs/CloseIcon";
import Search from "./Search";
import axios from "axios";
import router from 'next/router';
import VariantDto from "../models/VariantDto";
import Basket from "../models/Basket";

function Header() {
	const [search, setSearch] = useState<string>("");
	const [currentSearch, setCurrentSearch] = useState<string>("");
	const [products, setProducts] = useRecoilState<VariantDto[]>(searchProducts);
	const [showMenu, setShowMenu] = useRecoilState<boolean>(menuState);
	const [showBag, setShowBag] = useRecoilState<boolean>(bagState);
	const [showSearch, setShowSearch] = useRecoilState<boolean>(searchState);
	const basketData = useRecoilValue<Basket>(BasketData);
	function menuToggle() {
		setShowMenu(!showMenu);
		setShowBag(false);
		setShowSearch(false);
	}
	function bagToggle() {
		if (basketData.items.length > 0) {
			setShowBag(!showBag);
			setShowMenu(false);
			setShowSearch(false);
		}
	}
	const SearchOnClick = (e: React.MouseEvent) => {
		setCurrentSearch(search);
		router.push(`/search?search=${search}`)
	};

	useEffect(() => {
		axios
			.get<VariantDto[]>(`/api/shop/variants/search?search=${currentSearch}`)
			.then((res) => {
				setProducts(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [currentSearch]);

	function searchToggle() {
		setShowSearch(!showSearch);
		setShowBag(false);
		setShowMenu(false);
	}
	return (
		<header className="relative z-50 shadow-md">
			<div className="flex justify-between h-[80px] items-center px-6">
				<div className="flex items-center select-none">
					<MenuClosedIcon className={`${showMenu ? "hidden" : ""} mr-6 sm:hidden hover:cursor-pointer w-6 h-6`} onClick={menuToggle} />
					<CloseIcon className={`${showMenu ? "" : "hidden"} mr-6 sm:hidden hover:cursor-pointer w-6 h-6`} onClick={menuToggle} />
					<Link href="/">
						<a>
							<p className="mr-6">LOGO</p>
						</a>
					</Link>
					<nav className={`${showMenu ? "" : "hidden"} sm:block`}>
						<div className="absolute inset-x-0 flex flex-col mt-8 text-center bg-white shadow-md sm:flex-row sm:relative sm:mt-0 sm:shadow-none sm:space-x-6">
							<Link href="/men">
								<a className="">Mænd</a>
							</Link>
							<Link href="/women">
								<a className="">Kvinder</a>
							</Link>
							<Link href="/kids">
								<a className="">Børn</a>
							</Link>
						</div>
					</nav>
				</div>
				<div className="flex items-center space-x-3">
					<div
						className={`${
							showSearch ? "hidden" : ""
						} flex items-center justify-center w-8 h-8 bg-black rounded-full`}>
						<SearchIcon className="text-white fill-current hover:cursor-pointer h-6 w-6" onClick={searchToggle} />
					</div>
					<div
						className={`${
							showSearch ? "" : "hidden"
						} flex items-center justify-center w-8 h-8 bg-black rounded-full`}>
						<CloseIcon onClick={searchToggle} />
					</div>
					<div className="items-center justify-center hidden w-8 h-8 bg-black rounded-full sm:flex">
						<SupportIcon className="text-white fill-current hover:cursor-pointer h-6 w-6" />
					</div>
					<div className="items-center justify-center hidden w-8 h-8 bg-black rounded-full sm:flex">
						<UserIcon className="text-white fill-current hover:cursor-pointer h-6 w-6"/>
					</div>
					<div className="relative flex items-center justify-center w-8 h-8 bg-black rounded-full">
						{basketData.items.length > 0 && (
							<div className="absolute flex items-center justify-center w-5 h-5 text-xs text-white pointer-events-none translate-x-[50%] translate-y-[-70%] right-0 bg-red-500 rounded-full">
								{basketData.items.length > 9 ? "9+" : basketData.items.length}
							</div>
						)}
						<ShopBagIcon className="text-white fill-current hover:cursor-pointer w-6 h-6" onClick={bagToggle} />
					</div>
				</div>
			</div>
			<Search value={search} onChange={(e) => setSearch(e.target.value)} onSearch={SearchOnClick}/>
		</header>
	);
}

export default Header;
