import { ConfigProvider, notification } from "antd";
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import Home from "src/Pages/Home";

import Individuals from "src/Pages/Users/Individuals";

import NotFound from "src/Pages/NotFound";
import { theme } from "src/Utility/variables";
import Login from "src/Pages/Login";
import { pb } from "src/Utility/pocketbase";
import { canAccess, getCurrentRole } from "src/Utility/permissions";
import { Provider } from "react-redux";
import { store } from "./Redux/store";
import { createContext, useEffect, useState } from "react";

import Dealers from "./Pages/Users/Dealers";
import Sellers from "./Pages/Users/Sellers";
import Editors from "./Pages/Users/Editors";
import Admins from "./Pages/Users/Admins";

import SiteSettings from "./Pages/General/SiteSettings";
import SocialLinks from "./Pages/General/SocialLinks";
import Sliders from "./Pages/General/Sliders";
import Safety from "./Pages/General/Safety";
import Interior from "./Pages/General/Interior";
import Outdoor from "./Pages/General/Outdoor";
import Functional from "./Pages/General/Functional";
import Pages from "./Pages/General/Pages";
import AddPages from "./Pages/General/AddPages";
import EditPages from "./Pages/General/EditPages";

import BodyTypes from "./Pages/Vehicles/BodyTypes";
import Brands from "./Pages/Vehicles/Brands";
import Models from "./Pages/Vehicles/Models";
import Variants from "./Pages/Vehicles/Variants";
import AddVariants from "./Pages/Vehicles/Variants/Add";
import EditVariants from "./Pages/Vehicles/Variants/Edit";
import Listings from "./Pages/Vehicles/Listings";
import AddListing from "./Pages/Vehicles/Listings/Add";
import EditListing from "./Pages/Vehicles/Listings/Edit";

import Newsletter from "./Pages/Leads/Newsletter";
import ContactUs from "./Pages/Leads/ContactUs";
import Leads from "./Pages/Leads/Leads";
import Finance from "./Pages/Leads/Finance";

import Category from "./Pages/News/Category";
import Posts from "./Pages/News/Posts";
import EditPost from "./Pages/News/EditPost";
import AddPost from "./Pages/News/AddPost";

import MagazineLists from "./Pages/Subscriptions/Lists";
import MagazineSubscriptions from "./Pages/Subscriptions/Magazine";

export const NotificationContext = createContext(null);

function Protected() {
  let location = useLocation();
  if (!pb.authStore.isValid) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (!canAccess(location.pathname, getCurrentRole())) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

const App = () => {
  const [api, contextHolder] = notification.useNotification();
  const [, setAuthTick] = useState(0);

  useEffect(() => {
    // Refresh the cached auth record on mount so server-side role changes
    // propagate on page refresh (authStore is persisted in localStorage and
    // only updates at login time).
    if (pb.authStore.isValid) {
      const refresh = pb.authStore.isAdmin
        ? pb.admins.authRefresh()
        : pb.collection("admins").authRefresh();
      refresh.catch((err) => {
        if (err?.status === 401 || err?.status === 403) {
          pb.authStore.clear();
        }
      });
    }
    // Re-render whenever the auth store changes (login, logout, refresh).
    const unsubscribe = pb.authStore.onChange(() => {
      setAuthTick((n) => n + 1);
    });
    return unsubscribe;
  }, []);

  return (
    <Provider store={store}>
      <ConfigProvider theme={theme}>
        <NotificationContext.Provider value={api}>
          {contextHolder}
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Protected />}>
                <Route path="" element={<Home />} />
                <Route path="users">
                  <Route path="individual" element={<Individuals />} />
                  <Route path="dealers" element={<Dealers />} />
                  <Route path="sellers" element={<Sellers />} />
                  <Route path="editors" element={<Editors />} />
                  <Route path="admins" element={<Admins />} />
                </Route>
                <Route path="general">
                  <Route path="site-settings" element={<SiteSettings />} />
                  <Route path="social-links" element={<SocialLinks />} />
                  <Route path="sliders" element={<Sliders />} />
                  <Route path="safety" element={<Safety />} />
                  <Route path="interior" element={<Interior />} />
                  <Route path="outdoor" element={<Outdoor />} />
                  <Route path="functional" element={<Functional />} />
                  <Route path="pages" element={<Pages />} />
                  <Route path="pages/add" element={<AddPages />} />
                  <Route path="pages/:id" element={<EditPages />} />
                </Route>
                <Route path="vehicles">
                  <Route path="body-types" element={<BodyTypes />} />
                  <Route path="brands" element={<Brands />} />
                  <Route path="models" element={<Models />} />
                  <Route path="variants" element={<Variants />} />
                  <Route path="variants/add" element={<AddVariants />} />
                  <Route path="variants/:id" element={<EditVariants />} />
                  <Route path="listings" element={<Listings />} />
                  <Route path="listings/add" element={<AddListing />} />
                  <Route path="listings/:id" element={<EditListing />} />
                </Route>

                <Route path="leads">
                  <Route path="all" element={<Leads />} />
                  <Route path="finance-leads" element={<Finance />} />
                  <Route path="newsletter" element={<Newsletter />} />
                  <Route path="contact" element={<ContactUs />} />
                </Route>

                <Route path="news">
                  <Route path="category" element={<Category />} />
                  <Route path="posts" element={<Posts />} />
                  <Route path="posts/add" element={<AddPost />} />
                  <Route path="posts/:id" element={<EditPost />} />
                </Route>

                <Route path="sub">
                  <Route path="magazine">
                    <Route index element={<Navigate to="lists" replace />} />
                    <Route path="lists" element={<MagazineLists />} />
                    <Route path="subscription" element={<MagazineSubscriptions />} />
                  </Route>
                </Route>
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </NotificationContext.Provider>
      </ConfigProvider>
    </Provider>
  );
};

export default App;
