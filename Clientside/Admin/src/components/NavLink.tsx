import Link from "next/link";
import React, { ReactElement } from "react";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";

interface Props {
	href: string;
	text: string;
	Icon: (props: React.ComponentProps<"svg">) => JSX.Element;
}

function NavLink({ href, text, Icon }: Props): ReactElement {
	const router = useRouter();
	const isActive = router.route.includes(href);
	return (
		<>
			{isActive && (
				<Head>
					<title>{text}</title>
				</Head>
			)}

			<Link href={href} passHref>
				<div
					className={`cursor-pointer flex items-center w-full px-3 py-1 space-x-2 text-lg rounded-xl ${
						isActive ? "bg-white text-black" : "bg-black text-white"
					}`}>
					<Icon className={`w-6 h-6 rounded-full ${isActive ? "text-black" : " text-white"}`} />
					<div>{text}</div>
				</div>
			</Link>
		</>
	);
}

export default NavLink;
