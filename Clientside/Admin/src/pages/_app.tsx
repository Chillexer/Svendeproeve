import "../styles/tailwind.css";
import { UserProvider } from "@auth0/nextjs-auth0";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import AxiosErrorHandling from "../helpers/AxiosErrorHandling";

function MyApp({ Component, pageProps }: AppProps) {
	AxiosErrorHandling();

	return (
		<UserProvider>
			<Layout {...pageProps}>
				<Component {...pageProps}></Component>
			</Layout>
		</UserProvider>
	);
}
export default MyApp;
