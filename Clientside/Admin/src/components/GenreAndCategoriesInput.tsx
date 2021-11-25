import { XIcon } from "@heroicons/react/solid";
import axios, { AxiosResponse } from "axios";
import { debounce } from "lodash";
import React, { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import GenderDto from "../models/GenderDto";
import SearchCategoryDto from "../models/SearchCategoryDto";

interface Props {
	onChange: (selectedCategories: SearchCategoryDto[], genderId: number) => void;
	genderId?: number;
	selectedCategories?: SearchCategoryDto[];
}

function GenreAndCategoriesInput({
	onChange,
	selectedCategories: selectedCategoriesIn,
	genderId: genderIdIn,
}: Props): ReactElement {
	const [categoryResultsShown, setCategoryResultsShown] = useState(false);
	const [category, setCategory] = useState("");
	const [categories, setCategories] = useState<SearchCategoryDto[]>();
	const [selectedCategories, setSelectedCategories] = useState<SearchCategoryDto[]>([]);
	const [genderId, setGenderId] = useState(1);
	const [genders, setGenders] = useState<GenderDto[]>();
	const categoryRef = useRef<HTMLDivElement>(null);

	const mousedown = (e: MouseEvent) => {
		if (categoryRef && !categoryRef.current?.contains(e.target as Node)) {
			document.removeEventListener("mousedown", mousedown);
			setCategoryResultsShown(false);
		}
	};

	const categoryOnFocus = (e: React.FocusEvent<HTMLInputElement>) => {
		setCategoryResultsShown(true);
		document.addEventListener("mousedown", mousedown);
	};

	const categoryOnClick = (e: React.MouseEvent<HTMLDivElement>, category: SearchCategoryDto) => {
		var categories = [...selectedCategories];
		if (categories.filter((c) => c.id === category.id).length === 0) {
			categories.push(category);
			setSelectedCategories(categories);
			setCategoryResultsShown(false);
			setCategory("");
			onChange(categories, genderId);
			categoryRef?.current?.querySelector("input")?.focus();
			document.removeEventListener("mousedown", mousedown);
		}
	};

	const categoryOnDelete = (e: React.MouseEvent<HTMLDivElement>, category: SearchCategoryDto) => {
		const filteredList = selectedCategories.filter((c) => c.id !== category.id);
		setSelectedCategories(filteredList);
		onChange(filteredList, genderId);
	};

	const fetchCategories = (
		url: string,
		cb: (res: AxiosResponse<SearchCategoryDto[], any>) => void
	) => {
		axios
			.get<SearchCategoryDto[]>(url)
			.then((res) => {
				cb(res);
			})
			.catch((err) => console.log(err));
	};

	const debouncedFetchCategories = useCallback(
		debounce(
			(
				category: string,
				url: string,
				cb: (res: AxiosResponse<SearchCategoryDto[], any>) => void
			) => {
				if (category.trim() === "") setCategories(undefined);
				else fetchCategories(url, cb);
			},
			250
		),
		[]
	);

	useEffect(() => {
		debouncedFetchCategories(
			category,
			`/api/admin/categories/${genderId}/search?name=${category}`,
			(res) => {
				if (res.data.length > 0) {
					setCategories(res.data);
				} else setCategories(undefined);
			}
		);
	}, [category, genderId]);

	useEffect(() => {
		if (selectedCategoriesIn) {
			setSelectedCategories(selectedCategoriesIn);
		}
		if (genderIdIn) setGenderId(genderIdIn);
	}, [selectedCategoriesIn, genderIdIn]);

	useEffect(() => {
		axios
			.get<GenderDto[]>("/api/admin/genders")
			.then((res) => {
				setGenders(res.data);
				setGenderId(res.data.length > 0 ? res.data[0].id : 0);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	const categoryOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCategory(e.target.value);
	};

	const genderOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		if (genderId !== parseInt(e.target.value)) setSelectedCategories([]);
		setGenderId(parseInt(e.target.value));
		onChange(selectedCategories, genderId);
	};

	return (
		<>
			<div className="flex flex-col mt-4 mr-4 ">
				<label htmlFor="gender" className="font-semibold">
					Køn
				</label>
				<select
					required
					value={genderId}
					onChange={genderOnChange}
					name="genderId"
					className="p-3 py-0  h-[40px] focus-visible:outline-none w-full border rounded-md">
					{genders &&
						genders.map((gender) => (
							<option key={gender.id} value={gender.id}>
								{gender.genderName}
							</option>
						))}
				</select>
			</div>
			<div className="flex flex-col mt-4 ml-4">
				<label htmlFor="category" className="font-semibold">
					Kategorier
				</label>
				<div className="relative" ref={categoryRef}>
					<input
						value={category}
						onChange={categoryOnChange}
						type="text"
						onFocus={categoryOnFocus}
						placeholder="Søg efter kategori"
						name="category"
						className="p-3 h-[40px] focus-visible:outline-none w-full border rounded-md"></input>
					{categories && categoryResultsShown && (
						<div className="max-h-[200px] z-10 absolute left-0 right-0 flex flex-col border rounded-lg bg-white overflow-y-auto scrollbar scrollbar-thumb-gray-900 scrollbar-thin scrollbar-track-gray-100">
							{categories.map((category) => (
								<div
									onClick={(e) => categoryOnClick(e, category)}
									key={category.id}
									className="p-2 hover:font-medium hover:bg-gray-100 border-t-1 border-b-1">{`(${category.parentName}) ${category.name}`}</div>
							))}
						</div>
					)}
				</div>
			</div>
			<div className="flex flex-wrap gap-2 col-span-2 mt-4 min-h-[40px]">
				{selectedCategories &&
					selectedCategories.map((category) => (
						<div
							key={category.id}
							className="h-[30px] relative border w-max rounded-lg overflow-hidden px-3 flex items-center">
							<div>{`(${category.parentName}) ${category.name}`}</div>
							<div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-end opacity-0 hover:opacity-100 ">
								<div
									className="w-[30px] flex items-center justify-center h-full bg-rose-500"
									onClick={(e) => categoryOnDelete(e, category)}>
									<XIcon className="w-5 h-5 "></XIcon>{" "}
								</div>
							</div>
						</div>
					))}
			</div>
		</>
	);
}

export default GenreAndCategoriesInput;
