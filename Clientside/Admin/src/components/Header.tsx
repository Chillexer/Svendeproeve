import React, { ReactElement } from "react";
import Button from "./Button";

interface Props {
	title: string;
	hasButton?: boolean;
	buttonText?: string;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

function Header({ title, hasButton, buttonText, onClick }: Props): ReactElement {
	return (
		<div className="block w-full">
			<div className="grid w-full grid-cols-3 p-6">
				<div></div>
				<div className="flex items-center justify-center">
					<h2 className="text-2xl">{title}</h2>
				</div>
				<div className="ml-auto">
					{hasButton && (
						<Button
							size="large"
							text={buttonText ?? "Opret"}
							type="success"
							onClick={onClick}></Button>
					)}
				</div>
			</div>
		</div>
	);
}

export default Header;
