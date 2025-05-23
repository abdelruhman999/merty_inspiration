'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaBox , FaShoppingCart, FaCog } from 'react-icons/fa';
import { MdAnalytics } from "react-icons/md";
import { FaSignOutAlt } from "react-icons/fa";
import Swal from 'sweetalert2';

export function ClientSidebar() {
    const pathname = usePathname();

    const menuItems = [
        { href: '/kashir', label: 'الرئيسية', icon: FaHome },
        { href: '/kashir/product-list', label: 'المنتجات', icon: FaBox },
        { href: '/kashir/orders', label: 'الطلبات', icon: FaShoppingCart },
        { href: '/kashir/analytics', label: 'الاحصائيات', icon: MdAnalytics },
    ];0

    return (
        <div className="h-screen w-64 pb-[70px] flex flex-col justify-between bg-gray-800 text-white fixed right-0 top-0 p-4 overflow-y-auto" dir="rtl">
          <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-center">لوحة التحكم</h1>
            </div>
            <nav>
                <ul className="space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                                        isActive
                                            ? 'bg-blue-600 text-white'
                                            : 'hover:bg-gray-700'
                                    }`}
                                >
                                    <Icon className="ml-2" size={20} />
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
          </div>


            <div
            onClick={async () => {
                const result = await Swal.fire({
                title: 'تأكيد الخروج',
                text: 'هل أنت متأكد أنك تريد تسجيل الخروج؟',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'نعم، سجل الخروج',
                cancelButtonText: 'إلغاء',
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                });

                if (result.isConfirmed) {
                document.cookie = 'sessionid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                
                window.location.href = '/kashir-login';
                }
            }}
            className={`flex items-center gap-2 p-3 rounded-lg transition-colors bg-red-500/90 cursor-pointer text-white`}
            >
            <FaSignOutAlt />
            تسجيل الخروج
            </div>
        </div>
    );
}
