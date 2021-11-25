interface NestedCategory {
    id: number,
    parentId: number,
    name: string,
    childCategories: NestedCategory[],
    isSelected: boolean
}

export default NestedCategory