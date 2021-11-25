import React, { ReactElement, useEffect, useState } from "react";
import Link from "next/link";
import NestedCategory from "../models/NestedCategory";

interface Props {
	isFirst?: boolean;
	isSecond?: boolean;
	isMobile: boolean;
	prev?: string;
	category: NestedCategory;
	gender: any;
	categoryName?: string;

	selectedIds?: number[];
	setSelected?: (ids: number[]) => void;
}

function ProductCategory({
	gender,
	category,
	prev,
	isFirst,
	selectedIds: selectedIdsIn,
	isSecond,
	setSelected,
	categoryName,
	isMobile,
}: Props): ReactElement {
	const [selectedIds, setSelectedIds] = useState<number[]>([category.id]);

	useEffect(() => {
		if (categoryName?.toLowerCase() == category.name.toLowerCase()) {
			if (setSelected) setSelected([category.id]);
		} else if (!categoryName && isFirst) setSelectedIds([category.id]);
	}, [category, gender]);

	if (isFirst) {
		return (
			<>
				{category.childCategories?.map((c) => (
					<ProductCategory
						isMobile={isMobile}
						isSecond
						categoryName={categoryName}
						setSelected={setSelectedIds}
						selectedIds={selectedIds}
						gender={gender}
						category={c}
						key={c.id}
					/>
				))}
			</>
		);
	}

	const customSetSelected = (ids: number[]) => {
		ids.push(category.id);
		if (setSelected) setSelected(ids);
	};

	var split = prev?.split("/");
	let margin = 0;
	let isSelected = false;
	let isInSelection = false;
	let isParentSelected = false;
	let isParentInSelection = false;
	if (split && !isMobile) margin = split.length;
	if (selectedIdsIn && selectedIdsIn?.length > 0) {
		isSelected = selectedIdsIn.at(0) == category.id;
		isParentSelected = selectedIdsIn.at(0) == category.parentId;
		isInSelection = selectedIdsIn?.includes(category.id);
		isParentInSelection = selectedIdsIn?.includes(category.parentId);
	}
	let className = isMobile ? " first:!ml-0 hover:underline" : " ";
	if (isSelected) {
		className += " text-indigo-600";
	} else if (isParentSelected && !isInSelection) {
		className += " font-bold";
	} else {
		className += " text-gray-500";
	}

	return (
		<>
			{isSecond || isInSelection || isParentSelected || isParentInSelection ? (
				<Link
					href={`/${gender}/${prev ? prev.toLowerCase() + "/" : ""}${category.name.toLowerCase()}`}>
					<a
						style={{ marginLeft: margin * 6 + "px" }}
						className={(selectedIdsIn?.at(0) == category.id ? "font-bold" : "") + className}>
						{category.name}
					</a>
				</Link>
			) : (
				<></>
			)}
			{category.childCategories?.map((c) => (
				<ProductCategory
					isMobile={isMobile}
					setSelected={customSetSelected}
					categoryName={categoryName}
					selectedIds={selectedIdsIn}
					prev={(prev ? prev + "/" : "") + category.name}
					gender={gender}
					category={c}
					key={c.id}
				/>
			))}
		</>
	);
}

export default ProductCategory;
