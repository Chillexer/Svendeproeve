import React, { ReactElement } from "react";
import Button from "./Button";
import Moment from "react-moment";
import BaseProductDto from "../models/BaseProductDto";
import { useRouter } from "next/dist/client/router";

interface Props {
	product: BaseProductDto;
}

function InventoryItem({ product }: Props): ReactElement {
	const router = useRouter();

	const showOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		router.push(`/products/${product.id}`);
	};

	return (
		<>
			<div>
				<span>{product.id}</span>
			</div>
			<div>
				<span>{product.brand}</span>
			</div>
			<div>
				<span>{product.model}</span>
			</div>
			<div>
				<Moment date={product.updatedAt} format="DD-MM-yyyy"></Moment>
			</div>
			<div>
				<Moment date={product.createdAt} format="DD-MM-yyyy"></Moment>
			</div>
			<div>
				<Button onClick={showOnClick} size="small" text="Vis" type="info"></Button>
			</div>
		</>
	);
}

export default InventoryItem;
