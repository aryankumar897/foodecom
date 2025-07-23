
"use client"

import VerticalTabs from "@/components/dashboard/user/VerticalTabs";
import  ChangePassword from "@/components/dashboard/user/password/ChangePassword"
export default function DashboardPage() {
  return (
    <VerticalTabs>
      <ChangePassword/>
    </VerticalTabs>
  );
}