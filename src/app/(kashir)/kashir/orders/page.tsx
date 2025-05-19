'use client';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Table } from '@/component/Table/Table';
import { sendRequest } from '@/api';
import debounce from 'lodash/debounce';

interface Order extends Record<string, string | number> {
    id: number;
    customer_name: string;
    total_amount: number;
    status: string;
    created_at: string;
    source: string;
    type: string;
}

interface FormattedOrder extends Omit<Order, 'total_amount'> {
    total_amount: string;
}

interface OrdersResponse {
    results: Order[];
    count: number;
}

const PAGE_SIZE = 10;

// أنواع الفلاتر
const statusFilters = [
    { value: 'PENDING', label: 'قيد الانتظار' },
    { value: 'processing', label: 'قيد التنفيذ' },
    { value: 'ONWAY', label: 'في الطريق' },
    { value: 'DELIVERED', label: 'تم التسليم' },
    { value: 'CANCELLED', label: 'ملغي' }
];

const sourceFilters = [
    { value: 'HOTSPOT', label: 'نقطة بيع' },
    { value: 'WEBSITE', label: 'الموقع' },
    { value: 'INSTAGRAM', label: 'انستجرام' },
    { value: 'FACEBOOK', label: 'فيسبوك' },
    { value: 'TIKTOK', label: 'تيك توك' }
];

const typeFilters = [
    { value: 'COD', label: 'الدفع عند الاستلام' },
    { value: 'ONLINE', label: 'دفع إلكتروني' },
    { value: 'HOTSPOT', label: 'نقطة بيع' }
];

export default function OrderList() {
    
    const router = useRouter();
    const [orders, setOrders] = useState<FormattedOrder[]>([]);
    const [originalOrders, setOriginalOrders] = useState<FormattedOrder[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    
   
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [selectedSource, setSelectedSource] = useState<string>('');
    const [selectedType, setSelectedType] = useState<string>('');


    const headers = [
        { key: 'id', label: 'رقم الطلب' },
        { key: 'customer_name', label: 'اسم العميل' },
        { key: 'total_amount', label: 'المبلغ الإجمالي' },
        { key: 'status', label: 'الحالة' },
        { key: 'source', label: 'المصدر' },
        { key: 'payment_type', label: 'نوع الدفع' },
        { key: 'created_at', label: 'تاريخ الإنشاء' },
    ];

    const fetchOrders = async (page: number) => {
        try {
            setLoading(true);
            const response = await sendRequest<OrdersResponse>({
                method: 'GET',
                url:`/api/orders?search=${searchQuery}&status=${selectedStatus}&source=${selectedSource}&type=${selectedType}&page=${page}&page_size=${PAGE_SIZE}`,
              
            });
                        console.log(response.results);
                        
            const formattedOrders = response.results.map(order => ({
                ...order,
                customer_name: order.first_name,     
                created_at: new Date(order.created_at).toLocaleDateString('ar-EG'),
                total_amount: `${order.total_price} جنيه`,  
                status: getStatusInArabic(order.status),
                source: getSourceInArabic(order.source || ''),
                payment_type: getTypeInArabic(order.type)
            }));
            
            setOrders(formattedOrders);
            setOriginalOrders(formattedOrders);
            setTotalCount(response.count);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusInArabic = (status: string) => {
        const statusMap: Record<string, string> = {
            'PENDING': 'قيد الانتظار',
            'PROCESSING': 'قيد التنفيذ',
            'ONWAY': 'في الطريق',
            'DELIVERED': 'تم التسليم',
            'CANCELLED': 'ملغي'
        };
        return statusMap[status] || status;
    };

    const getSourceInArabic = (source: string) => {
        const sourceMap: Record<string, string> = {
            'HOTSPOT': 'نقطة بيع',
            'WEBSITE': 'الموقع',
            'INSTAGRAM': 'انستجرام',
            'FACEBOOK': 'فيسبوك',
            'TIKTOK': 'تيك توك'
        };
        return sourceMap[source] || source;
    };

    const getTypeInArabic = (type: string) => {
        const typeMap: Record<string, string> = {
            'COD': 'الدفع عند الاستلام',
            'ONLINE': 'دفع إلكتروني',
            'HOTSPOT': 'نقطة بيع'
        };
        return typeMap[type] || type;
    };

    useEffect(() => {
        fetchOrders(currentPage);
    }, [currentPage, selectedStatus, selectedSource, selectedType, searchQuery]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    
        const handleSearch = useCallback(
            debounce((searchText: string) => {
                setSearchQuery(searchText);
            }, 700), []
        );
    
    const handleSearch_two = (e: React.FormEvent) => {
        e.preventDefault();
            fetchOrders(1)
    };

    const handleResetFilters = () => {
        setSearchQuery('');
        setSelectedStatus('');
        setSelectedSource('');
        setSelectedType('');
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="p-6" dir="rtl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">الطلبات</h1>
                <button
                    onClick={() => router.push('/kashir')}
                    className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    إضافة طلب جديد
                </button>
            </div>

            {/* شريط البحث والفلاتر */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <form onSubmit={handleSearch_two} className="mb-4">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="ابحث برقم الطلب أو اسم العميل..."
                            onChange={(e) => handleSearch(e.target.value)}
                            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            بحث
                        </button>
                        <button
                            type="button"
                            onClick={handleResetFilters}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            إعادة الضبط
                        </button>
                    </div>
                </form>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* فلتر الحالة */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">حالة الطلب</label>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">الكل</option>
                            {statusFilters.map((filter) => (
                                <option key={filter.value} value={filter.value}>
                                    {filter.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* فلتر المصدر */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">مصدر الطلب</label>
                        <select
                            value={selectedSource}
                            onChange={(e) => 
                            {
                            setSelectedSource(e.target.value)
                            console.log(e.target.value);

                            }
                            
                            }
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">الكل</option>
                            {sourceFilters.map((filter) => (
                                <option key={filter.value} value={filter.value}>
                                    {filter.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* فلتر نوع الدفع */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">نوع الدفع</label>
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">الكل</option>
                            {typeFilters.map((filter) => (
                                <option key={filter.value} value={filter.value}>
                                    {filter.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
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
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded border disabled:opacity-50 ml-2"
                        >
                            السابق
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
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 rounded border disabled:opacity-50 mr-2"
                        >
                            التالي
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}