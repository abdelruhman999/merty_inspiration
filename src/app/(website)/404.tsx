import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 py-8 rtl" dir="rtl">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="relative w-64 h-64 mx-auto">
          <Image 
            src="/404-illustration.svg" 
            alt="الصفحة غير موجودة" 
            layout="fill" 
            objectFit="contain"
          />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-800">
            الصفحة غير موجودة
          </h1>
          
          <p className="text-gray-600 text-lg">
            عذراً! يبدو أن الصفحة التي تبحث عنها قد ذهبت في مغامرة غير متوقعة.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              href="/" 
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 inline-block"
            >
              العودة للرئيسية
            </Link>
            
            <Link 
              href="/contact" 
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition duration-300 inline-block"
            >
              تواصل مع الدعم
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}