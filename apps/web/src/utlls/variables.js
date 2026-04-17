import {
  CarOutlined,
  DollarOutlined,
  HeartOutlined,
  LogoutOutlined,
  PlusOutlined,
  ThunderboltOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { Inter } from "next/font/google";

export const font = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const primary = "#C02B22";
export const textColor = "#333";
export const backgroundColor = "#f9f9f9";
export const whiteColor = "#fff";
export const borderColor = "#eaeaea";
export const iconColor = "#666";
export const baseUrl = "http://127.0.0.1:8090/api";
export const menu = [
  {
    label: "new cars",
    key: 0,
    children: [
      {
        label: "Research",
        key: "new cars-0",
        link: "/new",
      },
      {
        label: "Dealers",
        key: "new cars-2",
        link: "/dealers",
      },
      {
        label: "Comparision",
        key: "new cars-3",
        link: "/new/compare",
      },
    ],
  },
  {
    label: "used cars",
    key: 1,
    children: [
      {
        label: "Research",
        key: "used cars-0",
        link: "/used",
      },
      {
        label: "Announcement of the day",
        key: "used cars-1",
        link: "/used/announcement",
      },
      {
        label: "Professional Sellers",
        key: "used cars-2",
        link: "/sellers",
      },
      {
        label: "Sell your car",
        key: "used cars-3",
      },
      {
        label: "Comparision",
        key: "used cars-4",
        link: "/used/compare",
      },
    ],
  },
  {
    label: "auto mag",
    key: 2,
    children: [
      {
        label: "Magazine",
        key: "auto mag-0",
        link: "/magazine",
      },
      {
        label: "Lifestyle",
        key: "auto mag-6",
        link: "/magazine/lifestyle",
      },
      {
        label: "What's New",
        key: "auto mag-1",
        link: "/magazine/whats-new",
      },
      {
        label: "News",
        key: "auto mag-2",
        link: "/magazine/news",
      },
      {
        label: "Trials",
        key: "auto mag-3",
        link: "/magazine/trials",
      },
      {
        label: "Concepts",
        key: "auto mag-4",
        link: "/magazine/concept",
      },
      {
        label: "Supercars",
        key: "auto mag-5",
        link: "/magazine/super-car",
      },
      {
        label: "Sports Auto",
        key: "auto mag-6",
        link: "/magazine/sports-auto",
      },

      {
        label: "All",
        key: "auto mag-t",
        link: "/magazine/all",
      },
    ],
  },
  {
    label: "practical guides",
    key: 3,
    children: [
      {
        label: "Guide 1",
        key: "practical guides-0",
      },
      {
        label: "Guide 2",
        key: "practical guides-1",
      },
      {
        label: "Guide 3",
        key: "practical guides-2",
      },
      {
        label: "Guide 4",
        key: "practical guides-3",
      },
    ],
  },
  {
    label: "My Space",
    key: 4,
    children: [],
    link: "/user",
  },
];

export const dashlist = [
  {
    name: "My Profile",
    icon: <UserOutlined />,
    link: "/user",
  },
  {
    name: "Create An Ad",
    icon: <PlusOutlined />,
    link: "/user/create",
  },
  {
    name: "My Ads",
    icon: <CarOutlined />,
    link: "/user/ads",
  },
  {
    name: "My Favorites",
    icon: <HeartOutlined />,
    link: "/user/favorites",
  },
  {
    name: "My Alerts",
    icon: <ThunderboltOutlined />,
    link: "/user/alerts",
  },
  {
    name: "Logout",
    icon: <LogoutOutlined />,
    action: () => {
      localStorage.removeItem("login");
    },
    link: "#",
  },
];

export const images = [
  {
    original:
      "https://occasion.automobile.tn/2021/08/67084_405677x3a75p2bi4t7svfuyok_max.webp?t=e60f0e208c371e700a68b3b7a3e5d4f9",
    thumbnail:
      "https://occasion.automobile.tn/2021/08/67084_405677x3a75p2bi4t7svfuyok_min.webp?t=e60f0e208c371e700a68b3b7a3e5d4f9",
  },
  {
    original:
      "https://occasion.automobile.tn/2021/08/67084_9dn81r3uq1fo2u3wcovksv0ms_max.webp?t=cbc6d6f9eeef1ea639f7a460239e4424",
    thumbnail:
      "https://occasion.automobile.tn/2021/08/67084_9dn81r3uq1fo2u3wcovksv0ms_min.webp?t=cbc6d6f9eeef1ea639f7a460239e4424",
  },
  {
    original:
      "https://occasion.automobile.tn/2021/08/67084_0wo6jgrltzsw4fzhvohloyo5n_max.webp?t=34898e4555ddd27d8451602880200a99",
    thumbnail:
      "https://occasion.automobile.tn/2021/08/67084_0wo6jgrltzsw4fzhvohloyo5n_min.webp?t=34898e4555ddd27d8451602880200a99",
  },
];
