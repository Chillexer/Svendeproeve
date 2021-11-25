import type { NextPage } from "next";
import GetStarted from "../components/GetStarted";
import PopularItems from "../components/PopularItems";
import Categories from "../components/Categories";
import React from "react";

const Home: NextPage = () => {
	return (
		<div>
			<GetStarted />
			<PopularItems />
			<Categories />
		</div>
	);
};

export default Home;
