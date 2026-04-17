import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { pb } from "src/Utility/pocketbase";

export const getIndividuals = createAsyncThunk("users/individuals", async () => {
  const records = await pb.collection("users").getFullList({
    sort: "-created",
    filter: 'role="user"',
    requestKey: null,
  });
  return records;
});

export const getDealers = createAsyncThunk("users/dealers", async () => {
  const records = await pb.collection("users").getFullList({
    sort: "-created",
    filter: 'role="dealership"',
    requestKey: null,
    expand: "brands",
  });
  return records;
});

export const getSellers = createAsyncThunk("users/sellers", async () => {
  const records = await pb.collection("users").getFullList({
    sort: "-created",
    filter: 'role="seller"',
    requestKey: null,
  });
  return records;
});

export const getEditors = createAsyncThunk("users/editors", async () => {
  const records = await pb.collection("admins").getFullList({
    sort: "-created",
    filter: 'role = "editor"',
    requestKey: null,
  });
  return records;
});

export const getAdmins = createAsyncThunk("users/admins", async () => {
  const records = await pb.collection("admins").getFullList({
    sort: "-created",
    filter: 'role = "super"',
    requestKey: null,
  });
  return records;
});

const userSlice = createSlice({
  name: "users",
  initialState: {
    individuals: [],
    loading: true,
    error: false,
    dealers: [],
    dealersLoading: true,
    dealersError: false,
    sellers: [],
    sellersLoading: true,
    sellersError: false,
    editors: [],
    editorsLoading: true,
    editorsError: false,
    admins: [],
    adminsLoading: true,
    adminsError: false,
  },
  reducers: {
    changeLoading(state, action) {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getIndividuals.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getIndividuals.fulfilled, (state, action) => {
      state.loading = false;
      state.individuals = action.payload;
    });
    builder.addCase(getIndividuals.rejected, (state) => {
      state.individuals = [];
      state.loading = false;
      state.error = true;
    });
    builder.addCase(getDealers.pending, (state) => {
      state.dealersLoading = true;
    });
    builder.addCase(getDealers.fulfilled, (state, action) => {
      state.dealersLoading = false;
      state.dealers = action.payload;
    });
    builder.addCase(getDealers.rejected, (state) => {
      state.dealers = [];
      state.dealersLoading = false;
      state.dealersError = true;
    });
    builder.addCase(getSellers.pending, (state) => {
      state.sellersLoading = true;
    });
    builder.addCase(getSellers.fulfilled, (state, action) => {
      state.sellersLoading = false;
      state.sellers = action.payload;
    });
    builder.addCase(getSellers.rejected, (state) => {
      state.sellers = [];
      state.sellersLoading = false;
      state.sellersError = true;
    });
    builder.addCase(getEditors.pending, (state) => {
      state.editorsLoading = true;
    });
    builder.addCase(getEditors.fulfilled, (state, action) => {
      state.editorsLoading = false;
      state.editors = action.payload;
    });
    builder.addCase(getEditors.rejected, (state) => {
      state.editors = [];
      state.editorsLoading = false;
      state.editorsError = true;
    });
    builder.addCase(getAdmins.pending, (state) => {
      state.adminsLoading = true;
    });
    builder.addCase(getAdmins.fulfilled, (state, action) => {
      state.adminsLoading = false;
      state.admins = action.payload;
    });
    builder.addCase(getAdmins.rejected, (state) => {
      state.admins = [];
      state.adminsLoading = false;
      state.adminsError = true;
    });
  },
});

export const { changeLoading } = userSlice.actions;
export default userSlice.reducer;
