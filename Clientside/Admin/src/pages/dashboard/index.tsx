import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import React from "react";
import DashboardOrders from "../../components/DashboardOrders";
import Graph from "../../components/Graph";
import Header from "../../components/Header";

const Dashboard = () => {
	return (
		<div className="grid h-screen" style={{ gridTemplateRows: "auto 1fr" }}>
			<Header title="Dashboard"></Header>
			<div className="grid gap-2 px-10 pb-5" style={{ gridTemplateRows: "50vh auto" }}>
				<Graph></Graph>
				<DashboardOrders></DashboardOrders>
			</div>
		</div>
	);
};

export default Dashboard;
