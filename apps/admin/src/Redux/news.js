import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { pb } from "src/Utility/pocketbase";

export const getNewsCategories = createAsyncThunk("news/category", async () => {
  const records = await pb.collection("news_categories").getFullList({
    sort: "position",
    requestKey: null,
  });
  return records;
});

export const getPosts = createAsyncThunk("news/Posts", async () => {
  const records = await pb.collection("news").getFullList({
    sort: "-created",
    requestKey: null,
    expand: "category_id",
  });
  return records;
});

export async function getSinglePost(id) {
  const records = await pb.collection("news").getOne(id, {
    requestKey: null,
    expand: "category_id",
  });
  return records;
}

const newsSlice = createSlice({
  name: "news",
  initialState: {
    categories: [],
    categoriesLoading: true,
    categoriesError: false,
    posts: [],
    postsLoading: true,
    postsError: false,
    singlePost: null,
    singlePostLoading: true,
    singlePostError: false,
  },
  reducers: {
    changeCategoriesLoading(state, action) {
      state.categoriesLoading = action.payload;
    },
    changePostsLoading(state, action) {
      state.postsLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Categories
    builder.addCase(getNewsCategories.pending, (state) => {
      state.categoriesLoading = true;
    });
    builder.addCase(getNewsCategories.fulfilled, (state, action) => {
      state.categoriesLoading = false;
      state.categories = action.payload;
    });
    builder.addCase(getNewsCategories.rejected, (state) => {
      state.categories = [];
      state.categoriesLoading = false;
      state.categoriesError = true;
    });

    // Posts
    builder.addCase(getPosts.pending, (state) => {
      state.postsLoading = true;
    });
    builder.addCase(getPosts.fulfilled, (state, action) => {
      state.postsLoading = false;
      state.posts = action.payload;
    });
    builder.addCase(getPosts.rejected, (state) => {
      state.posts = [];
      state.postsLoading = false;
      state.postsError = true;
    });
  },
});

export const { changeCategoriesLoading, changePostsLoading } = newsSlice.actions;
export default newsSlice.reducer;
