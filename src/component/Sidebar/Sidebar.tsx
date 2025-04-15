'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaBox, FaUsers, FaShoppingCart, FaCog } from 'react-icons/fa';

export function ClientSidebar() {
    const pathname = usePathname();

    const menuItems = [
        { href: '/kashir', label: 'الرئيسية', icon: FaHome },
        { href: '/kashir/product-list', label: 'المنتجات', icon: FaBox },
        { href: '/kashir/orders', label: 'الطلبات', icon: FaShoppingCart },
    ];

    return (
        <div className="h-screen w-64 bg-gray-800 text-white fixed right-0 top-0 p-4 overflow-y-auto" dir="rtl">
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
    );
}
