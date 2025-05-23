import type { FC } from 'react';

interface ContactUsProps {}

const ContactUs: FC<ContactUsProps> = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* قسم العنوان */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            تواصل مع ميرتي إنسبرايشن
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            نحن نتطلع لسماع منك! تواصل معنا للاستفسارات أو الدعم أو التعاون.
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* معلومات الاتصال */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">معلوماتنا</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">العنوان</h3>
                    <p className="mt-1 text-gray-600">
                      ٣٦ المحور المركزي،<br />
                      مدينة السادس من أكتوبر الأولى،<br />
                      محافظة الجيزة - مصر
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  {/* <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">البريد الإلكتروني</h3>
                    <p className="mt-1 text-gray-600">
                      info@mirtyinspiration.com<br />
                      support@mirtyinspiration.com
                    </p>
                  </div> */}
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">الهاتف</h3>
                    <p className="mt-1 text-gray-600">
                    01000355808 <br />
                    01026456902 <br />
                    01227727874 <br />
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">تابعنا</h3>
                <div className="flex space-x-6">
                  <a href="https://www.facebook.com/mertyinspiration/" className="text-gray-500 hover:text-gray-700">
                    <span className="sr-only">فيسبوك</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* نموذج الاتصال */}
            {/* <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">أرسل لنا رسالة</h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    الاسم الكامل
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    رسالتك
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  ></textarea>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    إرسال الرسالة
                  </button>
                </div>
              </form>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;