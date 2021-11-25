import React, { ReactElement, useEffect, useState } from "react";
import styles from "./InventoryList.module.css";
import faker from "faker";
import InventoryItem from "./InventoryItem";
import BaseProductDto from "../models/BaseProductDto";

interface Props {
	products: BaseProductDto[];
}

function InventoryList({ products }: Props): ReactElement {
	return (
		<div className="flex flex-row overflow-hidden">
			<div className={styles["inventorylist"]}>
				<div>ID</div>
				<div>Mærke</div>
				<div>Model</div>
				<div>Ændret</div>
				<div>Oprettet</div>
				<div></div>
				{/* Rows */}
				{products &&
					products.map((product) => (
						<InventoryItem key={product.id} product={product}></InventoryItem>
					))}
			</div>
		</div>
	);
}

export default InventoryList;
