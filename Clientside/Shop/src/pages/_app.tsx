import "../styles/tailwind.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import React from "react";
import ShopBag from "../components/ShopBag";
import { RecoilRoot } from "recoil";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<title>FNO Webshop</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<div className="flex flex-col h-screen">
				<RecoilRoot>
					<Header />
					<div className="relative flex-1">
						<ShopBag />
						<Component {...pageProps}></Component>
					</div>
				</RecoilRoot>
				<Footer />
			</div>
		</>
	);
}
export default MyApp;
