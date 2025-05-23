'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function ShoppingCartError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('خطأ سلة التسوق:', {
      message: error.message,
      name: error.name,
      digest: error.digest
    })
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50 p-4 rtl" dir="rtl">
      <div className="bg-white shadow-xl rounded-2xl p-8 text-center max-w-md w-full border border-red-100">
        <svg 
          className="mx-auto mb-6 h-20 w-20 text-red-600" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
          />
        </svg>
        <h2 className="text-3xl font-bold text-red-700 mb-4">
          سلة التسوق غير متاحة
        </h2>
        <p className="text-gray-600 mb-6 text-lg">
          {error.message || 'لا يمكن الوصول إلى سلة التسوق الآن.'}
        </p>
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => reset()}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            إعادة المحاولة
          </button>
          <Link 
            href="/products" 
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            مواصلة التسوق
          </Link>
        </div>
        {error.digest && (
          <p className="mt-4 text-xs text-gray-500">
            مرجع الخطأ: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
