import { useRouter } from "next/dist/client/router";

const OrderCompleted = () => {
	const router = useRouter();
	const { orderId } = router.query;

	return (
		<div className="text-center">
			<div className="my-5">
				<h1 className="mb-5 text-2xl font-bold">Tak for din order!</h1>
				<p>Din order er modtaget og vil blive behandlet</p>
				<p>En email vil blive sendt til dig med detaljer for din bestilling.</p>
			</div>
			<div className="p-10 bg-gray-100">
				<p>
					Dit ordrenummer er <span className="font-bold">#{orderId}</span>
				</p>
			</div>
		</div>
	);
};

export default OrderCompleted;
