import type { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Search from "../../components/Search";
import UserList from "../../components/UserList";
import UserDto from "../../models/UserDto";

const Users = () => {
	const [search, setSearch] = useState<string>("");
	const [currentSearch, setCurrentSearch] = useState<string>("");
	const [users, setUsers] = useState<UserDto[]>([]);
	var router = useRouter();

	const SearchOnClick = (e: React.MouseEvent) => {
		setCurrentSearch(search);
	};

	const CreateOnClick = (e: React.MouseEvent) => {
		router.push("/users/create");
	};

	useEffect(() => {
		axios
			.get<UserDto[]>(`/api/user/users?search=${currentSearch}`)
			.then((res) => {
				setUsers(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [currentSearch, search]);

	return (
		<div className="grid h-screen" style={{ gridTemplateRows: "auto 1fr" }}>
			<Header title="Brugerer" hasButton onClick={CreateOnClick}></Header>

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
					<UserList users={users}></UserList>
				</div>
			</div>
		</div>
	);
};

export default Users;
