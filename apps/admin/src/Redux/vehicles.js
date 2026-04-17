import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { pb } from "src/Utility/pocketbase";

export const getBrands = createAsyncThunk("vehicles/brands", async () => {
  const records = await pb.collection("brands").getFullList({
    sort: "@random",
    requestKey: null,
  });
  return records;
});

export const getBodyTypes = createAsyncThunk("vehicles/bodyTypes", async () => {
  const records = await pb.collection("body_types").getFullList({
    sort: "name",
    requestKey: null,
  });
  return records;
});

export const getModels = createAsyncThunk("vehicles/models", async (brand_id = null) => {
  const records = await pb.collection("models").getFullList({
    sort: "name",
    expand: "brand, body_types",
    requestKey: null,
    filter: brand_id ? `brand = "${brand_id}"` : null,
  });
  return records;
});

export const getVariants = createAsyncThunk("vehicles/variants", async () => {
  const records = await pb.collection("variants").getFullList({
    expand: "model, model.brand",
    requestKey: null,
  });
  return records;
});

export const getListings = createAsyncThunk("vehicles/listings", async () => {
  const records = await pb.collection("listings").getFullList({
    expand: "model, model.brand, variant, user",
    sort: "-created",
    requestKey: null,
  });
  return records;
});

export async function getSingleListing(id) {
  const record = await pb.collection("listings").getOne(id, {
    requestKey: null,
    expand: "model, model.brand, variant, user",
  });
  return record;
}

export async function getSingleVariant(id) {
  const records = await pb.collection("variants").getOne(id, {
    requestKey: null,
    expand: "model, model.brand",
  });
  return records;
}

const vehicleSlice = createSlice({
  name: "vehicles",
  initialState: {
    brands: [],
    brandsLoading: true,
    brandsError: false,
    bodyTypes: [],
    bodyTypesLoading: true,
    bodyTypesError: false,
    models: [],
    modelsLoading: true,
    modelsError: false,
    variants: [],
    variantsLoading: true,
    variantsError: false,
    listings: [],
    listingsLoading: true,
    listingsError: false,
  },
  reducers: {
    changeBrandsLoading(state, action) {
      state.brandsLoading = action.payload;
    },
    changeBodyTypesLoading(state, action) {
      state.bodyTypesLoading = action.payload;
    },
    changeModelsLoading(state, action) {
      state.modelsLoading = action.payload;
    },
    changeVariantsLoading(state, action) {
      state.variantsLoading = action.payload;
    },
    changeListingsLoading(state, action) {
      state.listingsLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Brands
    builder.addCase(getBrands.pending, (state) => {
      state.brandsLoading = true;
    });
    builder.addCase(getBrands.fulfilled, (state, action) => {
      state.brandsLoading = false;
      state.brands = action.payload;
    });
    builder.addCase(getBrands.rejected, (state) => {
      state.brands = [];
      state.brandsLoading = false;
      state.brandsError = true;
    });

    // Body Types
    builder.addCase(getBodyTypes.pending, (state) => {
      state.bodyTypesLoading = true;
    });
    builder.addCase(getBodyTypes.fulfilled, (state, action) => {
      state.bodyTypesLoading = false;
      state.bodyTypes = action.payload;
    });
    builder.addCase(getBodyTypes.rejected, (state) => {
      state.bodyTypes = [];
      state.bodyTypesLoading = false;
      state.bodyTypesError = true;
    });

    // Models
    builder.addCase(getModels.pending, (state) => {
      state.modelsLoading = true;
    });
    builder.addCase(getModels.fulfilled, (state, action) => {
      state.modelsLoading = false;
      state.models = action.payload;
    });
    builder.addCase(getModels.rejected, (state) => {
      state.models = [];
      state.modelsLoading = false;
      state.modelsError = true;
    });

    // Variants
    builder.addCase(getVariants.pending, (state) => {
      state.variantsLoading = true;
    });
    builder.addCase(getVariants.fulfilled, (state, action) => {
      state.variantsLoading = false;
      state.variants = action.payload;
    });
    builder.addCase(getVariants.rejected, (state) => {
      state.variants = [];
      state.variantsLoading = false;
      state.variantsError = true;
    });

    // Listings
    builder.addCase(getListings.pending, (state) => {
      state.listingsLoading = true;
    });
    builder.addCase(getListings.fulfilled, (state, action) => {
      state.listingsLoading = false;
      state.listings = action.payload;
    });
    builder.addCase(getListings.rejected, (state) => {
      state.listings = [];
      state.listingsLoading = false;
      state.listingsError = true;
    });
  },
});

export const { changeBrandsLoading, changeBodyTypesLoading, changeModelsLoading, changeVariantsLoading, changeListingsLoading } = vehicleSlice.actions;
export default vehicleSlice.reducer;
