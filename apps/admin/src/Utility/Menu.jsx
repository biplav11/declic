import {
  DashboardOutlined,
  UserOutlined,
  AppstoreOutlined,
  ReadOutlined,
  CarOutlined,
  FunnelPlotOutlined,
  LikeOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import {
  EDITOR_ALLOWED_GENERAL_CHILDREN,
  EDITOR_ALLOWED_MENU_KEYS,
  ROLE_EDITOR,
} from "src/Utility/permissions";

export function getSideMenu(navigate, role) {
  function getItem(label, icon, link, children) {
    if (children && children.length > 0) {
      return {
        key: label,
        label,
        icon,
        children,
      };
    }
    return {
      key: label,
      label,
      icon,
      onClick: () => (link ? navigate(link) : ""),
    };
  }
  const all = [
    getItem("Dashboard", <DashboardOutlined />, "/"),
    getItem("Users", <UserOutlined />, "/about", [
      getItem("Individual", "", "/users/individual"),
      getItem("Dealers", "", "/users/dealers"),
      getItem("Sellers", "", "/users/sellers"),
      getItem("Editors", "", "/users/editors"),
      getItem("Admins", "", "/users/admins"),
    ]),
    getItem("General", <AppstoreOutlined />, "/", [
      getItem("Site Settings", "", "/general/site-settings"),
      getItem("Sliders", "", "/general/sliders"),
      getItem("Social Links", "", "/general/social-links"),
      getItem("Pages", "", "/general/pages"),
      getItem("Safety", "", "/general/safety"),
      getItem("Interior", "", "/general/interior"),
      getItem("Outdoor", "", "/general/outdoor"),
      getItem("Functional", "", "/general/functional"),
    ]),
    getItem("News", <ReadOutlined />, "/", [getItem("Category", "", "/news/category"), getItem("Posts", "", "/news/posts")]),
    getItem("Vehicles", <CarOutlined />, "/", [
      getItem("Body Types", "", "/vehicles/body-types"),
      getItem("Brands", "", "/vehicles/brands"),
      getItem("Models", "", "/vehicles/models"),
      getItem("Variants", "", "/vehicles/variants"),
      getItem("Listings", "", "/vehicles/listings"),
    ]),
    getItem("Leads", <FunnelPlotOutlined />, "/", [
      getItem("All Leads", "", "/leads/all"),
      getItem("Finance Leads", "", "/leads/finance-leads"),
      getItem("Contact Us", "", "/leads/contact"),
      getItem("Newsletter", "", "/leads/newsletter"),
    ]),
    getItem("Magazine", <LikeOutlined />, "/", [
      getItem("Lists", "", "/sub/magazine/lists"),
      getItem("Subscription", "", "/sub/magazine/subscription"),
    ]),
    // getItem("Credits", <DollarOutlined />, "/credits"),
  ];

  const filtered =
    role === ROLE_EDITOR
      ? all
          .filter((item) => EDITOR_ALLOWED_MENU_KEYS.includes(item.key))
          .map((item) =>
            item.key === "General"
              ? {
                  ...item,
                  children: item.children.filter((c) =>
                    EDITOR_ALLOWED_GENERAL_CHILDREN.includes(c.key)
                  ),
                }
              : item
          )
      : all;

  return filtered.map((item) => [{ ...item }, { type: "divider" }]).flat();
}
