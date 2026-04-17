import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { pb } from "src/Utility/pocketbase";

export const getSiteSettings = createAsyncThunk("general/site_settings", async () => {
  const records = await pb.collection("site_settings").getFullList({
    sort: "created",
    requestKey: null,
  });
  return records;
});

export const getSocialLinks = createAsyncThunk("general/social_links", async () => {
  const records = await pb.collection("social_links").getFullList({
    sort: "created",
    requestKey: null,
  });
  return records;
});

export const getSliders = createAsyncThunk("general/sliders", async () => {
  const records = await pb.collection("sliders").getFullList({
    sort: "position",
    requestKey: null,
  });
  return records;
});

export const getInteriors = createAsyncThunk("general/interiors", async () => {
  const records = await pb.collection("interior").getFullList({
    requestKey: null,
  });
  return records;
});

export const getOutdoor = createAsyncThunk("general/outdoor", async () => {
  const records = await pb.collection("outdoor").getFullList({
    requestKey: null,
  });
  return records;
});

export const getFunctional = createAsyncThunk("general/functional", async () => {
  const records = await pb.collection("functional").getFullList({
    requestKey: null,
  });
  return records;
});

export const getSafety = createAsyncThunk("general/safety", async () => {
  const records = await pb.collection("safety").getFullList({
    requestKey: null,
  });
  return records;
});

export const getPages = createAsyncThunk("general/pages", async () => {
  const records = await pb.collection("pages").getFullList({
    sort: "-title",
    requestKey: null,
  });
  return records;
});

const generalSlice = createSlice({
  name: "brands",
  initialState: {
    siteSettings: [],
    siteSettingsLoading: true,
    siteSettingsError: false,
    socialLinks: [],
    socialLinksLoading: true,
    socialLinksError: false,
    sliders: [],
    slidersLoading: true,
    slidersError: false,
    pages: [],
    pagesLoading: true,
    pagesError: false,
    safety: [],
    safetyLoading: true,
    safetyError: false,
    interior: [],
    interiorLoading: true,
    interiorError: false,
    outdoor: [],
    outdoorLoading: true,
    outdoorError: false,
    functional: [],
    functionalLoading: true,
    functionalError: false,
  },
  reducers: {
    changeSiteSettingsLoading: (state, action) => {
      state.siteSettingsLoading = action.payload;
    },
    changeSocialLinksLoading: (state, action) => {
      state.socialLinksLoading = action.payload;
    },
    changeSlidersLoading(state, action) {
      state.slidersLoading = action.payload;
    },
    changeSafetyLoading(state, action) {
      state.safetyLoading = action.payload;
    },
    changeFunctionalLoading(state, action) {
      state.functionalLoading = action.payload;
    },
    changeInteriorLoading(state, action) {
      state.interiorLoading = action.payload;
    },
    changeOutdoorLoading(state, action) {
      state.outdoorLoading = action.payload;
    },
    changePagesLoading(state, action) {
      state.pagesLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // SiteSettings
    builder.addCase(getSiteSettings.pending, (state) => {
      state.siteSettingsLoading = true;
    });
    builder.addCase(getSiteSettings.fulfilled, (state, action) => {
      state.siteSettingsLoading = false;
      state.siteSettings = action.payload;
    });
    builder.addCase(getSiteSettings.rejected, (state) => {
      state.siteSettings = [];
      state.siteSettingsLoading = false;
      state.siteSettingsError = true;
    });
    // Social Links
    builder.addCase(getSocialLinks.pending, (state) => {
      state.socialLinksLoading = true;
    });
    builder.addCase(getSocialLinks.fulfilled, (state, action) => {
      state.socialLinksLoading = false;
      state.socialLinks = action.payload;
    });
    builder.addCase(getSocialLinks.rejected, (state) => {
      state.socialLinks = [];
      state.socialLinksLoading = false;
      state.socialLinksError = true;
    });
    // Sliders
    builder.addCase(getSliders.pending, (state) => {
      state.slidersLoading = true;
    });
    builder.addCase(getSliders.fulfilled, (state, action) => {
      state.slidersLoading = false;
      state.sliders = action.payload;
    });
    builder.addCase(getSliders.rejected, (state) => {
      state.sliders = [];
      state.slidersLoading = false;
      state.slidersError = true;
    });
    // Pages
    builder.addCase(getPages.pending, (state) => {
      state.pagesLoading = true;
    });
    builder.addCase(getPages.fulfilled, (state, action) => {
      state.pagesLoading = false;
      state.pages = action.payload;
    });
    builder.addCase(getPages.rejected, (state) => {
      state.pages = [];
      state.pagesLoading = false;
      state.pagesError = true;
    });

    // Safety
    builder.addCase(getSafety.pending, (state) => {
      state.safetyLoading = true;
    });
    builder.addCase(getSafety.fulfilled, (state, action) => {
      state.safetyLoading = false;
      state.safety = action.payload;
    });
    builder.addCase(getSafety.rejected, (state) => {
      state.safety = [];
      state.safetyLoading = false;
      state.safetyError = true;
    });

    // Interior
    builder.addCase(getInteriors.pending, (state) => {
      state.interiorLoading = true;
    });
    builder.addCase(getInteriors.fulfilled, (state, action) => {
      state.interiorLoading = false;
      state.interior = action.payload;
    });
    builder.addCase(getInteriors.rejected, (state) => {
      state.interior = [];
      state.interiorLoading = false;
      state.interiorError = true;
    });

    // Outdoor
    builder.addCase(getOutdoor.pending, (state) => {
      state.outdoorLoading = true;
    });
    builder.addCase(getOutdoor.fulfilled, (state, action) => {
      state.outdoorLoading = false;
      state.outdoor = action.payload;
    });
    builder.addCase(getOutdoor.rejected, (state) => {
      state.outdoor = [];
      state.outdoorLoading = false;
      state.outdoorError = true;
    });

    // Functional
    builder.addCase(getFunctional.pending, (state) => {
      state.functionalLoading = true;
    });
    builder.addCase(getFunctional.fulfilled, (state, action) => {
      state.functionalLoading = false;
      state.functional = action.payload;
    });
    builder.addCase(getFunctional.rejected, (state) => {
      state.functional = [];
      state.functionalLoading = false;
      state.functionalError = true;
    });
  },
});

export const {
  changeSiteSettingsLoading,
  changeSocialLinksLoading,
  changeSlidersLoading,
  changePagesLoading,
  changeSafetyLoading,
  changeInteriorLoading,
  changeOutdoorLoading,
  changeFunctionalLoading,
} = generalSlice.actions;

export default generalSlice.reducer;
