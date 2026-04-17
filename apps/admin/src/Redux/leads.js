import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { pb } from "src/Utility/pocketbase";

export const getNewsletter = createAsyncThunk("leads/newsletter", async () => {
  const records = await pb.collection("newsletters").getFullList({
    sort: "-created",
    requestKey: null,
  });
  return records;
});

export const getContactMessages = createAsyncThunk("leads/contact", async () => {
  const records = await pb.collection("contact_us").getFullList({
    sort: "-created",
    requestKey: null,
  });
  return records;
});

export const getLeads = createAsyncThunk("leads/leads", async () => {
  const records = await pb.collection("leads").getFullList({
    sort: "-created",
    requestKey: null,
  });
  return records;
});

export const getFinanceLeads = createAsyncThunk("leads/finance", async () => {
  const records = await pb.collection("finance_leads").getFullList({
    sort: "-created",
    requestKey: null,
  });
  return records;
});

const leadSlice = createSlice({
  name: "leads",
  initialState: {
    leads: [],
    leadsLoading: true,
    leadsError: false,
    financeLeads: [],
    financeLeadsLoading: true,
    financeLeadsError: false,
    newsletters: [],
    newslettersLoading: true,
    newslettersError: false,
    contactMessages: [],
    contactMessagesLoading: true,
    contactMessagesError: false,
  },
  reducers: {
    changeLeadsLoading(state, action) {
      state.leadsLoading = action.payload;
    },
    changeFinanceLeadsLoading(state, action) {
      state.financeLeadsLoading = action.payload;
    },
    changeNewsletterLoading(state, action) {
      state.newslettersLoading = action.payload;
    },
    changeContactMessagesLoading(state, action) {
      state.contactMessagesLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Leads
    builder.addCase(getLeads.pending, (state) => {
      state.leadsLoading = true;
    });
    builder.addCase(getLeads.fulfilled, (state, action) => {
      state.leadsLoading = false;
      state.leads = action.payload;
    });
    builder.addCase(getLeads.rejected, (state) => {
      state.leads = [];
      state.leadsLoading = false;
      state.leadsError = true;
    });

    // Finance Leads
    builder.addCase(getFinanceLeads.pending, (state) => {
      state.financeLeadsLoading = true;
    });
    builder.addCase(getFinanceLeads.fulfilled, (state, action) => {
      state.financeLeadsLoading = false;
      state.financeLeads = action.payload;
    });
    builder.addCase(getFinanceLeads.rejected, (state) => {
      state.financeLeads = [];
      state.financeLeadsLoading = false;
      state.financeLeadsError = true;
    });

    // Newsletters
    builder.addCase(getNewsletter.pending, (state) => {
      state.newslettersLoading = true;
    });
    builder.addCase(getNewsletter.fulfilled, (state, action) => {
      state.newslettersLoading = false;
      state.newsletters = action.payload;
    });
    builder.addCase(getNewsletter.rejected, (state) => {
      state.newsletters = [];
      state.newslettersLoading = false;
      state.newslettersError = true;
    });

    // Contact Messages
    builder.addCase(getContactMessages.pending, (state) => {
      state.contactMessagesLoading = true;
    });
    builder.addCase(getContactMessages.fulfilled, (state, action) => {
      state.contactMessagesLoading = false;
      state.contactMessages = action.payload;
    });
    builder.addCase(getContactMessages.rejected, (state) => {
      state.contactMessages = [];
      state.contactMessagesLoading = false;
      state.contactMessagesError = true;
    });
  },
});

export const { changeNewsletterLoading, changeContactMessagesLoading, changeLeadsLoading, changeFinanceLeadsLoading } = leadSlice.actions;
export default leadSlice.reducer;
