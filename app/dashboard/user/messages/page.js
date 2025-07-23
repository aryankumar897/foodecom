
"use client"

import VerticalTabs from "@/components/dashboard/user/VerticalTabs";
import  Message from "@/components/dashboard/user/message/Message"
export default function DashboardPage() {
  return (
    <VerticalTabs>
      <Message/>
    </VerticalTabs>
  );
}