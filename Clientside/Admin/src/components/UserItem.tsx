import React, { ReactElement } from "react";
import Button from "./Button";
import Moment from "react-moment";
import UserDto from "../models/UserDto";
import { useRouter } from "next/dist/client/router";

interface Props {
	user: UserDto;
}

function UserItem({ user }: Props): ReactElement {
	const router = useRouter();

	const showOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		router.push(`/users/${user.id}`);
	};

	return (
		<>
			<div>
				<span>{`${user.firstName} ${user.lastName}`}</span>
			</div>
			<div>
				<span>{user.email}</span>
			</div>
			<div>
				<span>{user.phone}</span>
			</div>
			<div>
				<Moment date={user.createdAt} format="DD-MM-yyyy"></Moment>
			</div>
			<div>
				<Button onClick={showOnClick} size="small" text="Vis" type="info"></Button>
			</div>
		</>
	);
}

export default UserItem;
