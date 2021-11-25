import { NextPage } from "next"
import React from "react"
import { useRecoilValue } from "recoil";
import { searchProducts } from "../../atoms/modalAtoms";
import ProductList from "../../components/ui/ProductList"

const Search: NextPage = () => {
    const variants = useRecoilValue(searchProducts);
    return(
        <div>
            {variants.length > 0 && (
					<div className="grid grid-cols-2 gap-3 p-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
						<ProductList variants={variants} />
					</div>
            )}
        </div>
    )
}

export default Search