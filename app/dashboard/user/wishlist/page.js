
"use client"


import VerticalTabs from "@/components/dashboard/user/VerticalTabs";
import  WishList from "@/components/dashboard/user/wishlist/WishList"
export default function DashboardPage() {
  return (
    <VerticalTabs>
      <WishList/>
    </VerticalTabs>
  );
}