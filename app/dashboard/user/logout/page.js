
"use client"

import VerticalTabs from "@/components/dashboard/user/VerticalTabs";
import  LogOut from "@/components/dashboard/user/logout/LogOut"
export default function DashboardPage() {
  return (
    <VerticalTabs>
      <LogOut/>
    </VerticalTabs>
  );
}