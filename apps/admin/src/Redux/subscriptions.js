import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { pb } from "src/Utility/pocketbase";

export const getMagazines = createAsyncThunk("subscriptions/magazines", async () => {
  const records = await pb.collection("magazine").getFullList({
    sort: "-created",
    requestKey: null,
  });
  return records;
});

export const getMagazineSubscriptions = createAsyncThunk(
  "subscriptions/magazine",
  async () => {
    const records = await pb.collection("magazine_subscriptions").getFullList({
      sort: "-created",
      expand: "magazine, user",
      requestKey: null,
    });
    return records;
  }
);

const subscriptionsSlice = createSlice({
  name: "subscriptions",
  initialState: {
    magazines: [],
    magazinesLoading: true,
    magazinesError: false,
    magazineSubscriptions: [],
    magazineSubscriptionsLoading: true,
    magazineSubscriptionsError: false,
  },
  reducers: {
    changeMagazinesLoading(state, action) {
      state.magazinesLoading = action.payload;
    },
    changeMagazineSubscriptionsLoading(state, action) {
      state.magazineSubscriptionsLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getMagazines.pending, (state) => {
      state.magazinesLoading = true;
    });
    builder.addCase(getMagazines.fulfilled, (state, action) => {
      state.magazinesLoading = false;
      state.magazines = action.payload;
    });
    builder.addCase(getMagazines.rejected, (state) => {
      state.magazines = [];
      state.magazinesLoading = false;
      state.magazinesError = true;
    });

    builder.addCase(getMagazineSubscriptions.pending, (state) => {
      state.magazineSubscriptionsLoading = true;
    });
    builder.addCase(getMagazineSubscriptions.fulfilled, (state, action) => {
      state.magazineSubscriptionsLoading = false;
      state.magazineSubscriptions = action.payload;
    });
    builder.addCase(getMagazineSubscriptions.rejected, (state) => {
      state.magazineSubscriptions = [];
      state.magazineSubscriptionsLoading = false;
      state.magazineSubscriptionsError = true;
    });
  },
});

export const { changeMagazinesLoading, changeMagazineSubscriptionsLoading } =
  subscriptionsSlice.actions;
export default subscriptionsSlice.reducer;
