
"use client"

import VerticalTabs from "@/components/dashboard/user/VerticalTabs";
import  Reservation from "@/components/dashboard/user/reservation/Reservation"
export default function DashboardPage() {
  return (
    <VerticalTabs>
      <Reservation/>
    </VerticalTabs>
  );
}