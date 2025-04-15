// app/admin/layout.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ClientSidebar } from '../../../component/Sidebar/Sidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const token = cookieStore.get('sessionid');

    if (!token) {
        redirect('/kashir-login');
    }

    return (
        <div className="min-h-screen bg-gray-100" dir="rtl">
            <ClientSidebar />
            <div className="mr-64 p-8">
                {children}
            </div>
        </div>
    );
}
