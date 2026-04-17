import { configureStore } from "@reduxjs/toolkit";
import user from "./users";
import vehicles from "./vehicles";
import general from "./general";
import leads from "./leads";
import news from "./news";
import subscriptions from "./subscriptions";

export const store = configureStore({
  reducer: {
    user,
    vehicles,
    general,
    leads,
    news,
    subscriptions,
  },
});
