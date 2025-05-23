'use client'
import { useEffect, useState } from 'react';
import { HiX } from "react-icons/hi";
export const PromoAlert = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has seen the alert before (using localStorage)
    const hasSeenAlert = localStorage.getItem('hasSeenPromoAlert');
    if (!hasSeenAlert) {
      setIsVisible(true);
      localStorage.setItem('hasSeenPromoAlert', 'true');
      
      // Auto-hide after 10 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bg-black/50 flex justify-center h-screen items-center w-full top-[0%] z-50   px-4">
      <div className="relative w-fit  rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-start space-x-3 rtl:space-x-reverse">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="text-right">
              <h3 className="text-lg font-medium text-white">عروض حصرية تنتظرك!</h3>
              <p className="mt-1 text-sm text-blue-100">
                اكتشف أحدث العروض والخصومات على منتجاتنا. اضغط هنا لرؤية التفاصيل المميزة!
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="rounded-md p-1 text-blue-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
          >
            <HiX  className="text-2xl cursor-pointer" />
          </button>
        </div>
        <div className="mt-3 flex justify-end pr-[20px]">
          <button
            onClick={() => window.location.href = '/sales'}
            className="rounded-md  cursor-pointer bg-white px-3 py-1.5 text-sm font-medium text-blue-600 shadow-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white"
          >
            عرض التفاصيل
          </button>
        </div>
      </div>
    </div>
  );
};