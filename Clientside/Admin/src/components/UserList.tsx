import React, { ReactElement, useEffect, useState } from "react";
import styles from "./UserList.module.css";
import faker from "faker";
import UserItem from "./UserItem";
import UserDto from "../models/UserDto";

interface Props {
	users: UserDto[];
}

function UserList({ users }: Props): ReactElement {
	return (
		<div className="flex flex-row overflow-hidden">
			<div className={styles["userlist"]}>
				<div>Navn</div>
				<div>Email</div>
				<div>Telefon</div>
				<div>Oprettet</div>
				<div></div>
				{/* Rows */}
				{users && users.map((user) => <UserItem key={user.id} user={user}></UserItem>)}
			</div>
		</div>
	);
}

export default UserList;
