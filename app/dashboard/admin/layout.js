
import AdminSidebar from '@/components/dashboard/admin/Admin';

import Footer from "@/components/footer/Footer"
export default function AdminLayout({ children }) {
    return (
        <>

            <AdminSidebar>

                {children}
                <Footer />
            </AdminSidebar>
        </>
    );
}