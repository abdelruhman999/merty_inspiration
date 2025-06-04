'use client';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { Table, TableHeader } from '@/component/Table/Table';
import { sendRequest } from '@/api';
import { Color, Size } from '@/types/product';
import ImageWithLoader from '@/component/ImageWithLoader';
import { serve } from '@/api/utils';

interface Product {
    id: number;
    name: string;
    description: string;
    is_active: string | number;
    colors: Color[];
    sizes: Size[];
}

interface ProductsResponse {
    results: Product[];
    count: number;
}

const PAGE_SIZE = 10;

const headers: TableHeader<Product>[] = [
    { key: 'id', label: 'رقم المنتج' },
    { key: 'name', label: 'اسم المنتج' },
    { key: 'description', label: 'الوصف' },
    { key: 'colors', label: 'الصورة' , render: (item) => item.colors && <ImageWithLoader src={serve(item.colors[0].image)} width="100" height="100" alt="" /> },
    { key: 'is_active', label: 'الحالة' , render: (item) => item.is_active ? <span className="text-green-500"   >مفعل</span> : <span className="text-red-500">معطل</span> },
];

export default function ProductList() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async (page: number) => {
        try {
            setLoading(true);
            const response = await sendRequest<ProductsResponse>({
                method: 'GET',
                url: `/api/products?page=${page}&page_size=${PAGE_SIZE}`,
            });
            setProducts(response.results);
            setTotalCount(response.count);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="p-6" dir="rtl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">المنتجات</h1>
                <button
                    onClick={() => router.push('/kashir/add-product')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    إضافة منتج جديد
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <>
                    <Table<Product>
                        headers={headers}
                        data={products}
                        onRowClick={(product) => router.push(`/kashir/edit-product/${product.id}`)}
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