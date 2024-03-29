import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Category } from "../entities/category";
import { CategoriesAPI } from "../api/categoriesAPI";
import { CreateCategoryDTO } from "../entities/CreateCategoryDTO";

export interface CategoryState {
  categories: Category[];
}

const initialState: CategoryState = {
  categories: [],
};

export const fetchCategories = createAsyncThunk("fetchCategories", async () => {
  return await CategoriesAPI.fetchAll();
});

export const createCategory = createAsyncThunk(
  "createCategory",
  async (category: CreateCategoryDTO) => {
    return await CategoriesAPI.createCategory(category);
  },
);

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.categories = action.payload;
    });
    builder.addCase(createCategory.fulfilled, (state, action) => {
      state.categories.push(action.payload);
    });
  },
});

export const {} = categorySlice.actions;
export default categorySlice.reducer;
