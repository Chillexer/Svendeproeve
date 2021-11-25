import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid";
import axios from "axios";
import React, { ReactElement, ReactText, useEffect, useRef, useState } from "react";
import ColorDto from "../models/ColorDto";
import ColorPickerDto from "../models/ColorPickerDto";
import ColorSquare from "./ColorSquare";
interface Props {
	selectedColors?: ColorDto[];
	onChange: (colors: number[]) => void;
}

function ColorPicker({ selectedColors, onChange }: Props): ReactElement {
	const [isOpen, setIsOpen] = useState(false);
	const [colors, setColors] = useState<ColorPickerDto[]>([]);
	const picker = useRef<HTMLDivElement>(null);

	const onMouseDown = (e: MouseEvent) => {
		if (picker && !picker.current?.contains(e.target as Node)) {
			document.removeEventListener("mousedown", onMouseDown);
			setIsOpen(false);
		}
	};

	const colorPickerOnClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
		if (!isOpen) {
			document.addEventListener("mousedown", onMouseDown);
			setIsOpen(true);
		} else setIsOpen(false);
	};

	const checkboxOnChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		color: ColorPickerDto
	): void => {
		const _colors = [...colors];

		var _color = _colors.find((s) => s.id == color.id);
		if (!_color) return;

		_color.selected = e.target.checked;
		setColors(_colors);
	};

	useEffect(() => {
		axios
			.get<ColorPickerDto[]>(`/api/admin/colors`)
			.then((res) => {
				let hasSelectedColors = selectedColors ? true : false;
				res.data.forEach((color) => {
					if (hasSelectedColors && selectedColors?.find((c) => c.id == color.id))
						color.selected = true;
					else color.selected = false;
				});
				setColors(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [selectedColors]);

	useEffect(() => {
		if (!colors) return;
		var _colors = [...colors];

		_colors.forEach((color) => {
			if (selectedColors?.find((c) => c.id == color.id)) color.selected = true;
			else color.selected = false;
		});
		setColors(_colors);
	}, [selectedColors]);

	useEffect(() => {
		var _colors: number[] = [];
		colors.forEach((color) => {
			if (color.selected) _colors.push(color.id);
		});

		onChange(_colors);
	}, [colors]);
	return (
		<div className="relative" ref={picker}>
			<div
				className={
					"p-3 h-[40px] focus-visible:outline-none w-full border rounded-md cursor-pointer flex items-center justify-between" +
					(isOpen ? " rounded-b-none" : "")
				}
				onClick={colorPickerOnClick}>
				<p className="select-none">Vælg farver</p>
				{isOpen ? <ChevronUpIcon className="w-9 h-9" /> : <ChevronDownIcon className="w-9 h-9" />}
			</div>
			<div
				className={
					"border border-t-0 absolute left-0 right-0 z-10 bg-white max-h-[200px] scrollbar scrollbar-thin scrollbar-thumb-black overflow-y-auto" +
					(isOpen ? "" : " hidden")
				}>
				{colors &&
					colors.map((color) => (
						<div
							className="flex items-center justify-between w-full h-10 px-3 border-b"
							key={color.id}>
							<div className="flex space-x-2">
								<ColorSquare hexValue={color.hexValue} />
								<p className="select-none">{color.colorName}</p>
							</div>
							<input
								type="checkbox"
								className="w-6 h-6"
								checked={color.selected ? true : false}
								onChange={(e) => checkboxOnChange(e, color)}></input>
						</div>
					))}
			</div>
		</div>
	);
}

export default ColorPicker;
