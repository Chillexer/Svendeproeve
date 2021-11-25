import axios from "axios";
import React, { ReactElement, useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";

interface Props {}

interface KeyValuePair {
	key: Date;
	value: number;
}

function Graph({}: Props): ReactElement {
	const [graphLabels, setGraphLabels] = useState<string[]>([]);
	const [graphData, setGraphData] = useState<number[]>([]);

	useEffect(() => {
		axios
			.get<KeyValuePair[]>("/api/admin/orders/last7days")
			.then((res) => {
				var labels: string[] = [];
				var data: number[] = [];

				res.data.forEach((v) => {
					v.key = new Date(v.key);
					labels.push(`${v.key.getDate()}/${v.key.getMonth()}`);
					data.push(v.value);
				});

				setGraphData(data);
				setGraphLabels(labels);
			})
			.catch((err) => console.log(err));
	}, []);

	return (
		<div className="max-w-full overflow-hidden max-h-[100%]">
			{graphLabels.length > 0 && graphData.length > 0 && (
				<Line
					data={{
						labels: graphLabels,
						datasets: [
							{
								label: "# af Ordrer",
								data: graphData,
								backgroundColor: "rgba(255, 99, 132, 0.2)",
								borderColor: "rgba(255, 99, 132, 1)",
								borderWidth: 1,
							},
						],
					}}
					options={{
						maintainAspectRatio: false,
						plugins: {
							legend: { display: false },
						},
					}}></Line>
			)}
		</div>
	);
}

export default Graph;
