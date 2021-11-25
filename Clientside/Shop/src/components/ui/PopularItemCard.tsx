import Link from "next/link";
import Image from "next/image";
import VariantDto from "../../models/VariantDto";
import FormatPrice from "../../helpers/FormatPrice";
interface Props {
	variant: VariantDto;
}

function PopularItemCard({ variant }: Props) {
	return (
		<div>
			{variant && (
				<>
					<div className="border border-black">
						<Image src={variant.imagePath} layout="responsive" width="200" height="200" alt="" />
					</div>
					<h2 className="overflow-hidden text-xs sm:text-base whitespace-nowrap overflow-ellipsis">
						{variant.product.model}
					</h2>
					{variant?.discountPrice ? (
						<p className="text-sm font-bold sm:text-lg">
							<span className="text-red-400">{FormatPrice(variant?.discountPrice)} DKK</span>
							<span className="font-normal line-through">
								{FormatPrice(variant.product?.price)} DKK
							</span>
						</p>
					) : (
						<p className="text-sm font-bold sm:text-lg">
							{FormatPrice(variant.product?.price)} DKK
						</p>
					)}
					<Link
						href={`/products/${
							encodeURIComponent(variant.product.model) + "-" + variant.productId
						}/${variant.id}`}>
						<a className="inline-block w-full text-center bg-black sm:px-5 sm:py-1">
							<span className="text-xs text-white sm:text-lg">Se Mere</span>
						</a>
					</Link>
				</>
			)}
			{/* måske skal w-full ikke bruges*/}
		</div>
	);
}

export default PopularItemCard;
