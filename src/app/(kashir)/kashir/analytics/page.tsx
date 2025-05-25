'use client';
import { sendRequest } from '@/api';
import React, { useEffect, useState } from 'react';

interface AnalyticsData {
  order_payment_types: {
    COD: { count: number; price: number };
    HOTSPOT: { count: number; price: number };
    ONLINE: { count: number; price: number };
  };
  order_status: {
    CANCELLED: { count: number; price: number };
    DELIVERED: { count: number; price: number };
    ONWAY: { count: number; price: number };
    PENDING: { count: number; price: number };
  };
  order_types: {
    FACEBOOK: { count: number; price: number };
    HOTSPOT: { count: number; price: number };
    INSTAGRAM: { count: number; price: number };
    TIKTOK: { count: number; price: number };
    WEBSITE: { count: number; price: number };
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
        console.log('تم جلب البيانات بنجاح:', response);
        
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

  const renderStatsCard = (title: string, value: number, secondaryValue?: number) => (
    <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
      <h3 className="text-gray-500 text-lg font-medium">{translateToArabic(title)}</h3>
      <p className="text-2xl font-bold text-blue-600 mt-2">{value}</p>
      {secondaryValue !== undefined && (
        <p className="text-gray-500 mt-1">{secondaryValue} ج.م</p>
      )}
    </div>
  );

  const renderSection = (title: string, data: Record<string, { count: number; price: number }>) => (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">{translateToArabic(title)}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="border rounded-lg p-4">
            <h3 className="text-gray-600 font-medium">{translateToArabic(key)}</h3>
            <div className="mt-2">
              <p className="text-gray-800">العدد: <span className="font-bold">{value.count}</span></p>
              <p className="text-gray-800">القيمة: <span className="font-bold">{value.price} ج.م</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">لوحة التحليلات</h1>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        إحصائيات شهر {new Date().getMonth() + 1}
      </h1>
            
      {/* الإحصائيات الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {renderStatsCard('total_orders', data.total_orders)}
        {renderStatsCard('total_revenue', data.total_revenue)}
      </div>
      
      {/* أنواع الدفع */}
      {renderSection('أنواع الدفع ', data.order_payment_types)}
      
      {/* حالات الطلب */}
      <div className="mt-8">
        {renderSection('حالات الطلب ', data.order_status)}
      </div>
      
      {/* مصادر الطلبات */}
      <div className="mt-8">
        {renderSection('مصادر الطلبات ', data.order_types)}
      </div>
    </div>
  );
};

export default AnalyticsPage;