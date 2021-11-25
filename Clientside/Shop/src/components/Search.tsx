import React, { ReactElement, useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";
import { searchState } from "../atoms/modalAtoms";
import SearchIcon from "./svgs/SearchIcon";

interface Props {
	value: string;
	onSearch: React.MouseEventHandler<HTMLSpanElement>;
	onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const Search = ({value, onSearch, onChange}:Props): ReactElement =>{
    const showSearch = useRecoilValue<boolean>(searchState);
    const searchInput = useRef<HTMLInputElement>(null);
    const searchRef = useRef<HTMLSpanElement>(null);
    useEffect(() => {
		if (showSearch) {
			searchInput.current?.focus();
		}
	},[showSearch]);

    
    return(
    <div className={`${showSearch ? "flex justify-center items-center bg-gray-900" : "hidden"}`}>
        <div className="relative w-2/3 p-3">
            <input
                type="search"
                value={value}
                onChange={onChange}
                onKeyUp={(e) => {
					e.key === "Enter" && searchRef!.current!.click();
				}}
                placeholder="Søg.."
                ref={searchInput}
                className="w-full p-3 pr-14 text-sm rounded"
            />
            <span className="absolute right-0 z-50 p-3 rounded" ref={searchRef} onClick={onSearch}>
                <SearchIcon className="text-black fill-current hover:cursor-pointer h-6 w-6 mr-5" />
            </span>
        </div>
    </div>
    )
}

export default Search