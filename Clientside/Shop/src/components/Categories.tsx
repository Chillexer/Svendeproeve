import GenderCard from "./ui/GenderCard";

function Categories() {
	return (
		<div className="sm:bg-red-600">
			<div className="grid grid-cols-3 gap-1 p-1 md:gap-3 md:py-2 mx-auto lg:w-[1000px]">
			<GenderCard gender="men" />
			<GenderCard gender="women" />
			<GenderCard gender="kids" />
			</div>
		</div>
	);
}

export default Categories;
