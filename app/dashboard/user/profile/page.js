// app/dashboard/page.js
import VerticalTabs from "@/components/dashboard/user/VerticalTabs";
import  PersonolInfo from "@/components/dashboard/user/profile/PersonolInfo"
export default function DashboardPage() {
  return (
    <VerticalTabs>
      <PersonolInfo/>
    </VerticalTabs>
  );
}