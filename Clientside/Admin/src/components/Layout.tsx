import Sidebar from "./Sidebar";

import React, { PropsWithChildren, ReactElement } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

interface Props { }

function Layout({ children }: PropsWithChildren<Props>): ReactElement {
	return (
		<div className="pl-[250px] bg-[#FAFAFA] min-h-screen">
			<Sidebar></Sidebar>
			<main className="relative h-screen">{children}</main>
		</div>
	);
}

export default withPageAuthRequired(Layout);
