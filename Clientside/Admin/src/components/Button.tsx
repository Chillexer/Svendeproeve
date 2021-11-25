import React, { ReactElement } from "react";

interface Props {
	size: "xsmall" | "small" | "large";

	buttonType?: "submit" | "button";
	className?: string;
	text: string;
	type: "success" | "warning" | "error" | "info" | "secondary";
	disabled?: boolean;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

function Button({
	size,
	text,
	buttonType,
	type,
	disabled,
	className,
	onClick,
}: Props): ReactElement {
	let extraClasses;

	switch (size) {
		case "xsmall":
			extraClasses = "px-3 h-[30px]";
			break;
		case "small":
			extraClasses = "px-12 h-[30px]";
			break;
		case "large":
			extraClasses = "px-12 h-[40px]";
			break;
	}

	switch (type) {
		case "success":
			extraClasses += " bg-green-400";
			break;
		case "warning":
			extraClasses += " bg-yellow-500";
			break;
		case "error":
			extraClasses += " bg-red-500";
			break;
		case "info":
			extraClasses += " bg-sky-400";
			break;
		case "secondary":
			extraClasses += " bg-gray-400";
			break;
	}

	return (
		<button
			type={buttonType ? buttonType : "button"}
			onClick={onClick}
			disabled={disabled}
			className={`text-white rounded-3xl disabled:opacity-50 disabled:cursor-not-allowed ${extraClasses} ${
				className ? className : ""
			}`}>
			{text}
		</button>
	);
}

export default Button;
