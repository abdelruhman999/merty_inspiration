'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Table } from '@/component/Table/Table';
import { sendRequest } from '@/api';

interface Order extends Record<string, string | number> {
    id: number;
    customer_name: string;
    total_amount: number;
    status: string;
    created_at: string;
}

interface FormattedOrder extends Omit<Order, 'total_amount'> {
    total_amount: string;
}

interface OrdersResponse {
    results: Order[];
    count: number;
}

const PAGE_SIZE = 10;

export default function OrderList() {
    const router = useRouter();
    const [orders, setOrders] = useState<FormattedOrder[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const headers = [
        { key: 'id', label: 'رقم الطلب' },
        { key: 'customer_name', label: 'اسم العميل' },
        { key: 'total_amount', label: 'المبلغ الإجمالي' },
        { key: 'status', label: 'الحالة' },
        { key: 'created_at', label: 'تاريخ الإنشاء' },
    ];

    const fetchOrders = async (page: number) => {
        try {
            setLoading(true);
            const response = await sendRequest<OrdersResponse>({
                method: 'GET',
                url: `/api/orders?page=${page}&page_size=${PAGE_SIZE}`,
            });
            
            // Format the dates and amounts in the response
            const formattedOrders = response.results.map(order => ({
                ...order,
                created_at: new Date(order.created_at).toLocaleDateString('ar-EG'),
                total_amount: `${order.total_amount} جنيه`,
                status: getStatusInArabic(order.status)
            }));
            
            setOrders(formattedOrders);
            setTotalCount(response.count);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusInArabic = (status: string) => {
        const statusMap: Record<string, string> = {
            'pending': 'قيد الانتظار',
            'processing': 'قيد التنفيذ',
            'completed': 'مكتمل',
            'cancelled': 'ملغي'
        };
        return statusMap[status] || status;
    };

    useEffect(() => {
        fetchOrders(currentPage);
    }, [currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="p-6" dir="rtl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">الطلبات</h1>
                <button
                    onClick={() => router.push('/kashir/orders/create')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    إضافة طلب جديد
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <>
                    <Table<FormattedOrder>
                        headers={headers}
                        data={orders}
                        onRowClick={(order) => router.push(`/kashir/orders/${order.id}`)}
                    />

                    {/* Pagination */}
                    <div className="flex justify-center space-x-2 mt-6">
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 rounded border disabled:opacity-50 mr-2"
                        >
                            التالي
                        </button>
                        {pageNumbers.map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-3 py-1 rounded border mx-1 ${
                                    currentPage === page
                                        ? 'bg-blue-600 text-white'
                                        : 'hover:bg-gray-100'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded border disabled:opacity-50 ml-2"
                        >
                            السابق
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
