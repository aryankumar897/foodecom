
"use client"

import VerticalTabs from "@/components/dashboard/user/VerticalTabs";
import  Orders from "@/components/dashboard/user/orders/Orders"
export default function DashboardPage() {
  return (
    <VerticalTabs>
      <Orders/>
    </VerticalTabs>
  );
}