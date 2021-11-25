import React, { ReactElement, useEffect, useState } from "react";
import VariantDto from "../../models/VariantDto";
import ProductCard from "./ProductCard";

interface Props {
	variants: VariantDto[];
}

function ProductList({ variants }: Props): ReactElement {
	return (
		<>
		{variants.map((variant) => (
				<ProductCard key={variant.id} variant={variant}></ProductCard>
			))}
		</>
	);
}

export default ProductList;
