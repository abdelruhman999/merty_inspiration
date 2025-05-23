'use client' // Error boundaries must be Client Components
 
import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('تفاصيل الخطأ:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      digest: error.digest
    })
  }, [error])
 
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 rtl" dir="rtl">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center max-w-md w-full">
        <svg 
          className="mx-auto mb-4 h-16 w-16 text-red-500" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          عذراً! حدث خطأ ما
        </h2>
        <p className="text-gray-600 mb-6">
          {error.message || 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.'}
        </p>
        <div className="flex space-x-4 justify-center">
          <button
            onClick={() => reset()}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            إعادة المحاولة
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition duration-300"
          >
            العودة للصفحة الرئيسية
          </button>
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