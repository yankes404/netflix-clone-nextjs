import { allCategories } from "./constants";
import { Category } from "./types";

export const getCategory = (id: Category) => {
    const category = allCategories.find((category) => category.id === id);
    return category;
}

export const getCategoryTitle = (id: Category) => {
    const category = getCategory(id);
    return category?.title ?? null;
}

export const getAllCategoriesIds = () => allCategories.map((category) => category.id);
export const getCategoryTitles = (ids: Category[]) => ids.map((id) => getCategoryTitle(id)).filter((title) => typeof title === "string");