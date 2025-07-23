import React from "react";
import { Tab, useTheme } from "@mui/material"; // Added useTheme import
import Link from "next/link";
import {
  Dashboard as DashboardIcon,
  AccountCircle as ProfileIcon,
  Lock as PasswordIcon,
  Email as MessagesIcon,
  Fastfood as OrdersIcon,
  EventAvailable as ReservationsIcon,
  Star as ReviewsIcon,
  Favorite as WishlistIcon,
  LocationOn as AddressIcon,
} from "@mui/icons-material";
import { TabIconContainer } from "./styles";

export const tabItems = [
  { icon: <DashboardIcon />, label: "Dashboard", value: 0, path: "/dashboard/user" },
  { icon: <ProfileIcon />, label: "Profile", value: 1, path: "/dashboard/user/profile" },
  { icon: <PasswordIcon />, label: "Password", value: 2, path: "/dashboard/user/password" },
  { icon: <MessagesIcon />, label: "Messages", value: 3, path: "/dashboard/user/messages" },
  { icon: <OrdersIcon />, label: "My Orders", value: 4, path: "/dashboard/user/orders" },
  { icon: <ReservationsIcon />, label: "Reservations", value: 5, path: "/dashboard/user/reservations" },
  { icon: <ReviewsIcon />, label: "Reviews", value: 6, path: "/dashboard/user/reviews" },
  { icon: <WishlistIcon />, label: "Wishlist", value: 7, path: "/dashboard/user/wishlist" },
  { icon: <AddressIcon />, label: "Addresses", value: 8, path: "/dashboard/user/addresses" },
];

export const CustomTab = ({ item, value, handleChange }) => {
  const theme = useTheme(); // Using the theme hook
  
  return (
    <Link href={item.path} passHref legacyBehavior>
      <Tab
        component="a"
        label={
          <TabIconContainer className={value === item.value ? "Mui-selected" : ""}>
            {item.icon}
            <span style={{ 
              color: value === item.value ? '#000' : '#000',
              fontSize: '16px',
              fontWeight:"800"
            }}>
              {item.label}
            </span>
          </TabIconContainer>
        }
        value={item.value}
        onClick={(event) => handleChange(event, item.value)}
        sx={{
          minHeight: '60px',
          padding: '8px 12px',
          [theme.breakpoints.up('sm')]: { // Now theme is properly defined
            minHeight: '48px',
            padding: '12px 30px',
          }
        }}
      />
    </Link>
  );
};