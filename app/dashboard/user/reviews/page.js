
"use client"

import VerticalTabs from "@/components/dashboard/user/VerticalTabs";
import  Review from "@/components/dashboard/user/review/Review"
export default function DashboardPage() {
  return (
    <VerticalTabs>
      <Review/>
    </VerticalTabs>
  );
}