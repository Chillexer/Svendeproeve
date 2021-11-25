import React, { ReactElement } from "react";

interface Props {
	hexValue?: string;
}

function ColorSquare({ hexValue }: Props): ReactElement {
	if (hexValue)
		return (
			<div
				className={`w-6 h-6 ${
					hexValue.toLowerCase() === "#ffffff" ? "border border-gray-400" : ""
				}`}
				style={{ backgroundColor: hexValue }}
			/>
		);
	else
		return (
			<div className="flex flex-wrap w-6 h-6">
				<div className="bg-[#ffdd33] w-[12px] h-[12px]"></div>
				<div className="bg-[#5ad36c] w-[12px] h-[12px]"></div>
				<div className="bg-[#f563b9] w-[12px] h-[12px]"></div>
				<div className="bg-[#0f73ad] w-[12px] h-[12px]"></div>
			</div>
		);
}

export default ColorSquare;
