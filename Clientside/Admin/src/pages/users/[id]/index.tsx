import Image from "next/image";
import axios, { AxiosError, AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/dist/client/router";
import UserDto from "../../../models/UserDto";
import Header from "../../../components/Header";
import Moment from "react-moment";
import { AtSymbolIcon, HomeIcon, PhoneIcon } from "@heroicons/react/outline";
import Button from "../../../components/Button";
import { useUser } from "@auth0/nextjs-auth0";

const User = () => {
	const [User, setUser] = useState<UserDto>();
	const session = useUser();

	const router = useRouter();
	const { id } = router.query;

	const backOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		router.push("/users");
	};

	const deleteOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		axios
			.delete(`/api/user/users/${User?.id}`)
			.then((res: AxiosResponse) => {
				router.push("/users");
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const editOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		router.push(`/users/${User?.id}/edit`);
	};

	useEffect(() => {
		axios
			.get<UserDto>("/api/user/users/" + id)
			.then((res: AxiosResponse) => {
				setUser(res.data);
			})
			.catch((err: AxiosError) => {
				console.log(err);
			});
	}, [id]);

	return (
		<div>
			<Header title="Vis bruger"></Header>
			{User && (
				<div className="w-[700px] p-10 py-7  mx-auto bg-white rounded-lg">
					<div className="flex pb-2 border-b-2 border-black">
						<Image
							className="w-40 h-40 rounded-3xl"
							width="160"
							height="160"
							alt=""
							src={User.imageUrl}></Image>
						<div className="ml-5 w-[440px]">
							<div>
								<p className="text-xl font-semibold">{`${User.firstName} ${User.lastName}`}</p>
							</div>
							<div className="flex items-center mt-2 w-[412px]">
								<AtSymbolIcon className="p-1 text-white bg-blue-500 rounded w-7 h-7 " />
								<div className="ml-2 overflow-hidden text-lg whitespace-nowrap overflow-ellipsis">
									{User.email}
								</div>
							</div>
							<div className="flex items-center mt-2">
								<PhoneIcon className="p-1 text-white bg-blue-500 rounded w-7 h-7 " />
								<p className="ml-2 text-lg">{User.phone}</p>
							</div>
							<div className="flex mt-2 w-[440px]">
								<HomeIcon className="flex-shrink-0 p-1 text-white bg-blue-500 rounded w-7 h-7" />
								<div className="ml-2 text-lg w-[412px]">
									<p className="overflow-hidden whitespace-nowrap overflow-ellipsis">
										{User.address}
									</p>
									<p>{`${User.town}, ${User.zipCode}`}</p>
								</div>
							</div>
						</div>
					</div>

					<div className="flex justify-between mt-2">
						<div>
							<p>
								<span className="mr-2">Sidst Redigeret: </span>{" "}
								<Moment date={User.updatedAt} format="DD-MM-yyyy"></Moment>
							</p>
						</div>
						<div>
							<p>
								<span className="mr-2">Oprettet:</span>
								<Moment date={User.createdAt} format="DD-MM-yyyy"></Moment>
							</p>
						</div>
					</div>

					<div className="flex mt-4">
						<Button onClick={backOnClick} size="large" text="Tilbage" type="secondary"></Button>

						<Button
							disabled={!User || session?.user?.name?.toLowerCase() === User?.email?.toLowerCase()}
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

export default User;
