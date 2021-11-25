import Image from "next/image";
import axios, { AxiosError, AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/dist/client/router";
import EditUserDto from "../../../models/EditUserDto";
import Button from "../../../components/Button";
import UserDto from "../../../models/UserDto";

const EditUser = () => {
	const [User, setUser] = useState<UserDto>();
	const [EditUser, setEditUser] = useState<any>({
		firstName: "",
		lastName: "",
		address: "",
		phone: "",
		town: "",
		zipCode: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const router = useRouter();
	const { id } = router.query;

	const inputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEditUser({ ...EditUser, [e.target.name]: e.target.value });
	};

	const cancelOnClick = (e: React.MouseEvent) => {
		router.push(`/users/${User?.id}`);
	};

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		var data = { ...EditUser };
		if (data.zipCode === "") delete data.zipCode;

		axios
			.put<EditUserDto>(`/api/user/users/${User?.id}`, data)
			.then((res: AxiosResponse) => {
				if (res.status === 200) router.push(`/users/${User?.id}`);
			})
			.catch((err: AxiosError) => {
				console.log(err);
				if (err.response?.status === 404) router.push(`/users`);
				else setErrorMessage("Der er sket en ukendt fejl");
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	useEffect(() => {
		axios
			.get<UserDto>("/api/user/users/" + id)
			.then((res: AxiosResponse) => {
				setUser(res.data);
				setEditUser(res.data);
			})
			.catch((err: AxiosError) => {
				console.log(err);
			});
	}, [id]);

	return (
		<div className="w-[700px] p-10 py-7  mx-auto bg-white rounded-lg">
			<div className="flex justify-center pb-2">
				<Image
					className="rounded-3xl"
					width="160"
					height="160"
					layout="responsive"
					alt=""
					src={User?.imageUrl!}></Image>
			</div>
			<form onSubmit={onSubmit}>
				<div className="grid grid-cols-2">
					<div className="flex flex-col mt-4 mr-4">
						<label htmlFor="firstName" className="font-semibold">
							Fornavn
						</label>
						<input
							required
							value={EditUser.firstName}
							onChange={inputOnChange}
							name="firstName"
							className="p-3  h-[40px] focus-visible:outline-none w-full border rounded-md"></input>
					</div>
					<div className="flex flex-col mt-4 ml-4">
						<label htmlFor="lastName" className="font-semibold">
							Efternavn
						</label>
						<input
							required
							value={EditUser.lastName}
							onChange={inputOnChange}
							name="lastName"
							className="p-3  h-[40px] focus-visible:outline-none w-full border rounded-md"></input>
					</div>
					<div className="flex flex-col mt-4 mr-4">
						<label htmlFor="address" className="font-semibold">
							Adresse
						</label>
						<input
							value={EditUser.address}
							onChange={inputOnChange}
							name="address"
							className="p-3  h-[40px] focus-visible:outline-none w-full border rounded-md"></input>
					</div>
					<div className="flex flex-col mt-4 ml-4">
						<label htmlFor="zipCode" className="font-semibold">
							Postnr.
						</label>
						<input
							value={EditUser.zipCode}
							onChange={inputOnChange}
							type="number"
							name="zipCode"
							className="p-3  h-[40px] focus-visible:outline-none w-full border rounded-md"></input>
					</div>
					<div className="flex flex-col mt-4 mr-4">
						<label htmlFor="phone" className="font-semibold">
							Telefon
						</label>
						<input
							value={EditUser.phone}
							onChange={inputOnChange}
							type="tel"
							name="phone"
							className="p-3  h-[40px] focus-visible:outline-none w-full border rounded-md"></input>
					</div>
					<div className="flex flex-col mt-4 ml-4">
						<label htmlFor="town" className="font-semibold">
							By
						</label>
						<input
							value={EditUser.town}
							onChange={inputOnChange}
							name="town"
							className="p-3  h-[40px] focus-visible:outline-none w-full border rounded-md"></input>
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
	);
};

export default EditUser;
