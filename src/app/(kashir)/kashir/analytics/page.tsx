'use client';
import { sendRequest } from '@/api';
import React, { useEffect, useState } from 'react';

interface AnalyticsData {
  order_payment_types: {
    COD: number;
    HOTSPOT: number;
    ONLINE: number;
  };
  order_status: {
    CANCELLED: number;
    DELIVERED: number;
    ONWAY: number;
    PENDING: number;
  };
  order_types: {
    FACEBOOK: number;
    HOTSPOT: number;
    INSTAGRAM: number;
    TIKTOK: number;
    WEBSITE: number;
  };
  total_orders: number;
  total_revenue: number;
}

// دالة لتحويل النصوص الإنجليزية إلى عربية
const translateToArabic = (key: string): string => {
  const translations: Record<string, string> = {
    COD: 'الدفع عند الاستلام',
    HOTSPOT: 'نقاط البيع',
    ONLINE: 'الدفع الإلكتروني',
    CANCELLED: 'ملغية',
    DELIVERED: 'تم التسليم',
    ONWAY: 'قيد التوصيل',
    PENDING: 'قيد الانتظار',
    FACEBOOK: 'فيسبوك',
    INSTAGRAM: 'إنستجرام',
    TIKTOK: 'تيك توك',
    WEBSITE: 'الموقع الإلكتروني',
    total_orders: 'إجمالي الطلبات',
    total_revenue: 'إجمالي الإيرادات'
  };

  return translations[key] || key;
};

const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sendRequest<AnalyticsData>({
      url: '/api/analytics',
      method: 'GET',
    })
      .then((response) => {
        setData(response);
      })
      .catch((error) => {
        console.error('حدث خطأ في جلب البيانات:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mr-2">جاري تحميل البيانات...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">فشل تحميل بيانات التحليل</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">لوحة التحليل والإحصائيات</h1>
      
      {/* بطاقات الملخص */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">إجمالي الطلبات</h2>
          <p className="text-3xl font-bold text-blue-600">{data.total_orders}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">إجمالي الإيرادات</h2>
          <p className="text-3xl font-bold text-green-600">{data.total_revenue.toLocaleString()} ج.م</p>
        </div>
      </div>

      {/* حالة الطلب */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">حالات الطلبات</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(data.order_status).map(([status, count]) => (
            <div key={status} className="border p-4 rounded">
              <p className="text-sm text-gray-500">{translateToArabic(status)}</p>
              <p className="text-2xl font-bold">{count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* طرق الدفع */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">طرق الدفع</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(data.order_payment_types).map(([method, count]) => (
            <div key={method} className="border p-4 rounded">
              <p className="text-sm text-gray-500">{translateToArabic(method)}</p>
              <p className="text-2xl font-bold">{count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* مصادر الطلبات */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">مصادر الطلبات</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(data.order_types).map(([source, count]) => (
            <div key={source} className="border p-4 rounded">
              <p className="text-sm text-gray-500">{translateToArabic(source)}</p>
              <p className="text-2xl font-bold">{count}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default AnalyticsPage;