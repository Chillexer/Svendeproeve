import { SearchIcon } from "@heroicons/react/outline";
import React, { ReactElement, useRef } from "react";

interface Props {
	value: string;
	onSearch: React.MouseEventHandler<HTMLDivElement>;
	onChange: React.ChangeEventHandler<HTMLInputElement>;
}

function Search({ value, onSearch, onChange }: Props): ReactElement {
	const searchRef = useRef<HTMLDivElement>(null);

	return (
		<div className="flex items-center overflow-hidden border border-gray-400 rounded-md focus-within:border-blue-500">
			<input
				value={value}
				onChange={onChange}
				onKeyUp={(e) => {
					e.key === "Enter" && searchRef!.current!.click();
				}}
				type="search"
				placeholder="Søg..."
				className="p-3  h-[40px] focus-visible:outline-none w-full"
			/>
			<div
				ref={searchRef}
				onClick={onSearch}
				className="w-[50px] h-[40px] flex items-center justify-center cursor-pointer bg-blue-500">
				<SearchIcon className="w-6 h-6 "></SearchIcon>
			</div>
		</div>
	);
}

export default Search;
