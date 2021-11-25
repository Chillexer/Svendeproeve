import type { NextPage } from "next";
import axios, { AxiosError, AxiosResponse } from "axios";
import React, { useState } from "react";
import Button from "../../components/Button";
import Header from "../../components/Header";
import { useRouter } from "next/dist/client/router";
import UserDto from "../../models/UserDto";

const CreateUser = () => {
	const [newUser, setNewUser] = useState<any>({
		address: "",
		email: "",
		firstName: "",
		lastName: "",
		password: "",
		phone: "",
		town: "",
		zipCode: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	var router = useRouter();

	const cancelOnClick = (e: React.MouseEvent) => {
		router.push("/users");
	};

	const inputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewUser({ ...newUser, [e.target.name]: e.target.value });
	};

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		var data = { ...newUser };
		if (data.zipCode === "") delete data.zipCode;

		axios
			.post<UserDto>("/api/user/users", data)
			.then((res: AxiosResponse) => {
				if (res.status === 201) router.push("/users/" + res.data.id);
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
			<Header title="Opret bruger"></Header>

			<div className="w-[700px] p-10 mx-auto bg-white rounded-lg">
				<form onSubmit={onSubmit}>
					<div className="grid grid-cols-2">
						<div className="flex flex-col mr-4">
							<label htmlFor="email" className="font-semibold">
								Email
							</label>
							<input
								required
								value={newUser.email}
								onChange={inputOnChange}
								type="email"
								name="email"
								className="p-3  h-[40px] focus-visible:outline-none w-full border rounded-md"></input>
						</div>
						<div className="flex flex-col ml-4">
							<label htmlFor="password" className="font-semibold">
								Kodeord
							</label>
							<input
								required
								value={newUser.password}
								onChange={inputOnChange}
								type="password"
								name="password"
								className="p-3  h-[40px] focus-visible:outline-none w-full border rounded-md"></input>
						</div>
						<div className="flex flex-col mt-4 mr-4">
							<label htmlFor="firstName" className="font-semibold">
								Fornavn
							</label>
							<input
								required
								value={newUser.firstName}
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
								value={newUser.lastName}
								onChange={inputOnChange}
								name="lastName"
								className="p-3  h-[40px] focus-visible:outline-none w-full border rounded-md"></input>
						</div>
						<div className="flex flex-col mt-4 mr-4">
							<label htmlFor="address" className="font-semibold">
								Adresse
							</label>
							<input
								value={newUser.address}
								onChange={inputOnChange}
								name="address"
								className="p-3  h-[40px] focus-visible:outline-none w-full border rounded-md"></input>
						</div>
						<div className="flex flex-col mt-4 ml-4">
							<label htmlFor="zipCode" className="font-semibold">
								Postnr.
							</label>
							<input
								value={newUser.zipCode}
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
								value={newUser.phone}
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
								value={newUser.town}
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
							text="Opret"
							buttonType="submit"
							type="success"
							className="mt-8"></Button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default CreateUser;
