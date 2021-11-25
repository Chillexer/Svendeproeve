import Image from "next/image";
import Link from "next/link";
import FormatPrice from "../../helpers/FormatPrice";
import VariantDto from "../../models/VariantDto";

interface Props {
	variant: VariantDto;
}

function ProductCard({ variant }: Props) {
	return (
		<div>
			<Link
				href={`/products/${encodeURIComponent(variant.product.model) + "-" + variant.productId}/${
					variant.id
				}`}>
				<a className="">
					<div>
						<Image
							layout="responsive"
							src={variant.imagePath}
							height="500"
							width="500"
							alt="Produkt"
						/>
						{variant.product.model}
					</div>
				</a>
			</Link>
			{variant?.discountPrice ? (
				<p className="space-x-2">
					<span className="text-red-400">{FormatPrice(variant?.discountPrice)} DKK</span>
					<span className="line-through">{FormatPrice(variant.product?.price)} DKK</span>
				</p>
			) : (
				<p>{FormatPrice(variant.product?.price)} DKK</p>
			)}
		</div>
	);
}

export default ProductCard;
