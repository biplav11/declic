export const theme = {
  // algorithm: thm.compactAlgorithm,
  token: {
    colorPrimary: "#1d1d1c",
    controlItemBgActive: "#e4e9ec",
    borderRadius: 0,
  },
  components: {
    Layout: {
      headerBg: "white",
      siderBg: "white",
      triggerBg: "#fff",
      triggerColor: "#000",
      bodyBg: "#f9f9f9",
    },
  },
};

export const API_URL = "http://127.0.0.1:8090";
export const LOGO_URL = "https://www.nreo.org.np/declic/logo.svg";

export const alignmentOptions = [
  "Top Left",
  "Top Center",
  "Top Right",
  "Middle Left",
  "Center",
  "Middle Right",
  "Bottom Left",
  "Bottom Center",
  "Bottom Right",
].map((value) => ({ label: value, value }));

export const statuses = ["Unfollowed", "Followed", "Interested", "Won", "Lost"];
export const sources = ["Website", "Social Sites", "Phone", "Referral", "Other"];
