import { useRouter } from "next/dist/client/router";
import React, { ReactElement, useEffect, useState } from "react";
import NavLink from "./NavLink";
import Image from "next/image";
import {
	UserCircleIcon,
	CollectionIcon,
	CreditCardIcon,
	PresentationChartLineIcon,
} from "@heroicons/react/solid";
import axios from "axios";
import UserDto from "../models/UserDto";
import Button from "./Button";

interface Props {}

function Sidebar({}: Props): ReactElement {
	const router = useRouter();
	const [User, setUser] = useState<UserDto | null>(null);

	useEffect(() => {
		axios
			.get<UserDto>("/api/user/users/me")
			.then((res) => {
				setUser(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [setUser]);

	return (
		<nav className="fixed z-50 h-full flex flex-col overflow-auto m-0 p-0 left-0 w-[250px] bg-black text-center text-white ">
			<div className="flex justify-center w-full mt-3">
				<div className="flex justify-center w-4/5 text-lg border-b-2">
					<p>Vores Web Shop</p>
				</div>
			</div>

			<div className="w-full px-6 mt-32 text-left">
				<div className="flex flex-col space-y-2">
					<NavLink Icon={PresentationChartLineIcon} href="/dashboard" text="Dashboard"></NavLink>
					<NavLink Icon={CollectionIcon} href="/products" text="Inventar"></NavLink>
					<NavLink Icon={CreditCardIcon} href="/orders" text="Ordrer"></NavLink>
					<NavLink Icon={UserCircleIcon} href="/users" text="Brugere"></NavLink>
				</div>
			</div>

			<div className="w-full px-4 mt-auto mb-4 space-y-4">
				<div className="flex items-center space-x-3">
					{User?.imageUrl && (
						<Image
							className="rounded-full"
							alt=""
							width="40"
							height="40"
							src={User?.imageUrl!}></Image>
					)}
					<p className="text-xl">{User?.firstName.split(" ")[0]}</p>
				</div>

				<Button
					className="w-full"
					onClick={(e) => {
						router.push("/api/auth/logout");
					}}
					size="large"
					text="Log ud"
					type="error"
				/>
			</div>
		</nav>
	);
}

export default Sidebar;
