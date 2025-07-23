
"use client"

import VerticalTabs from "@/components/dashboard/user/VerticalTabs";
import  Address from "@/components/dashboard/user/address/AddressList"
export default function DashboardPage() {
  return (
    <VerticalTabs>
      <Address/>
    </VerticalTabs>
  );
}