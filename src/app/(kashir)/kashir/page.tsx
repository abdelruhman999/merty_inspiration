'use client';
import type { FC } from 'react';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaQrcode, FaSearch, FaPrint, FaTimes } from 'react-icons/fa';
import { useReactToPrint } from 'react-to-print';
import { useRef, useState } from 'react';
import logo from '../../../../assets/logo.png';
import Image from 'next/image';

interface ProductData {
  barcode: number;
  name: string;
  price: number;
  discountPrice?: number;
  category: string;
  quantity: number;
  size?: string;
  color?: string;
}

interface CustomerData {
  name: string;
  phone: string;
  address: string;
}

interface InvoiceItem extends ProductData {
  total: number;
}

const CashierSystem: FC = () => {
  const { 
    register: registerProduct,
    handleSubmit: handleProductSubmit,
    setValue: setProductValue,
    watch: watchProduct,
    reset: resetProduct,
    formState: { errors: productErrors },
  } = useForm<ProductData>({ defaultValues: { price: 1000,  discountPrice: 0, category: '', quantity: 1 } });

  const { 
    register: registerCustomer,
    handleSubmit: handleCustomerSubmit,
    setValue: setCustomerValue,
    watch: watchCustomer,
    formState: { errors: customerErrors },
  } = useForm<CustomerData>();

  const [cart, setCart] = useState<InvoiceItem[]>([]);
  const [isPrinting, setIsPrinting] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  // محاكاة استرجاع بيانات المنتج
  const fetchProductData = (barcode: number) => {
    console.log('Searching for product with barcode:', barcode);
    const product = watchProduct();
    // بيانات تجريبية
    const mockProduct: ProductData = {
      barcode: barcode,
      name: 'تيشيرت رجالي قطني',
      price: product.price || 100.00,
      discountPrice: product.discountPrice || 80.00,
      category: 'ملابس رجالي',
      quantity: 1,
      size: 'XL',
      color: 'أزرق'
    };
  };

  // إضافة منتج للسلة
  const addToCart = () => {
    const product = watchProduct();
    if (!product.barcode) return;

    const existingItemIndex = cart.findIndex(item => item.barcode === product.barcode);
    console.log(`existingItemIndex: ${existingItemIndex}`);
        
    if (existingItemIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += product.quantity || 1;
      updatedCart[existingItemIndex].total = 
        (updatedCart[existingItemIndex].discountPrice || updatedCart[existingItemIndex].price) * 
        updatedCart[existingItemIndex].quantity;
      setCart(updatedCart);
    } else {
      setCart([...cart, {
        ...product,
        name: product.name, 
        quantity: product.quantity || 1,
        total: (product.discountPrice || product.price) * (product.quantity || 1)
      }]);
    }

    resetProduct();
  };

  // إزالة منتج من السلة
  const removeFromCart = (barcode: string) => {
    setCart(cart.filter(item => item.barcode !== Number(barcode)));
  };

  // حساب الإجمالي
  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const delivary_price = 150; 
  const total = subtotal + delivary_price;


  useEffect(()=>{
    if(cart.length > 0){
        console.log(cart); 
    }
  },[cart])

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center"> الكاشير</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* قسم مسح المنتج */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h2 className="font-medium text-gray-700 mb-4">إدخال المنتج</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">باركود المنتج</label>
              <div className="relative">
                <input
                  type="text"
                  {...registerProduct('barcode', { required: 'مطلوب' })}
                  onBlur={(e) => fetchProductData(Number(e.target.value))}
                  className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    productErrors.barcode ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                  }`}
                  placeholder="مسح الباركود"
                />
                <FaQrcode className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الكمية</label>
                <input
                  type="number"
                  {...registerProduct('quantity', { 
                    min: { value: 1, message: 'الحد الأدنى للكمية هو 1' }, 
                    max: { value: 1000, message: 'الحد الأقصى للكمية هو 1000' }, 
                    valueAsNumber: true, 
                    required: 'مطلوب' 
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
                {productErrors.quantity && (
                  <span className="text-red-500 text-sm">{productErrors.quantity.message}</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">السعر</label>
                <input
                  type="number"
                  {...registerProduct('price')}
                  readOnly
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <button
              onClick={addToCart}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
            >
              إضافة للسلة
            </button>
          </div>

          {/* قسم بيانات العميل */}
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h2 className="font-medium text-gray-700 mb-4">بيانات العميل</h2>
            
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">اسم العميل</label>
              <input
                type="text"
                {...registerCustomer('name', { required: 'مطلوب' })}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  customerErrors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                }`}
                placeholder="اسم العميل"
              />
              {customerErrors.name && (
                <span className="text-red-500 text-sm">{customerErrors.name.message}</span>
              )}
            </div>
            
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
              <input
                type="tel"
                {...registerCustomer('phone', { 
                  required: 'مطلوب',
                  pattern: {
                    value: /^01[0125][0-9]{8}$/,
                    message: 'رقم هاتف غير صحيح'
                  }
                })}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  customerErrors.phone ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                }`}
                placeholder="رقم الهاتف"
              />
              {customerErrors.phone && (
                <span className="text-red-500 text-sm">{customerErrors.phone.message}</span>
              )}
            </div>
            
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
              <textarea
                {...registerCustomer('address', { required: 'مطلوب' })}
                rows={3}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  customerErrors.address ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                }`}
                placeholder="العنوان بالتفصيل"
              />
              {customerErrors.address && (
                <span className="text-red-500 text-sm">{customerErrors.address.message}</span>
              )}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h2 className="font-medium text-gray-700 mb-4">أوامر سريعة</h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                disabled={cart.length === 0}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md ${
                  cart.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                <FaPrint /> طباعة
              </button>
              <button
                onClick={() => setCart([])}
                disabled={cart.length === 0}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md ${
                  cart.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                <FaTimes /> إلغاء
              </button>
            </div>
          </div>
        </div>

        {/* قسم السلة والفاتورة */}
        <div className="lg:col-span-2">
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h2 className="font-medium text-gray-700 mb-4">سلة المشتريات</h2>
            
            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                لا توجد منتجات في السلة
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">المنتج</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">السعر</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">الكمية</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">الإجمالي</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cart.map((item) => (
                       
                        
                      <tr key={item.barcode}>
                        <td className="px-4 py-2 text-right">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.barcode}</div>
                        </td>
                        <td className="px-4 py-2 text-right">
                          {item.discountPrice ? (
                            <>
                              <span className="line-through text-gray-400 text-sm">{item.price} ج.م</span>
                              <br />
                              <span className="text-red-600">{item.discountPrice} ج.م</span>
                            </>
                          ) : (
                            <span>{item.price} ج.م</span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-right">{item.quantity}</td>
                        <td className="px-4 py-2 text-right font-medium">{item.total.toFixed(2)} ج.م</td>
                        <td className="px-4 py-2 text-right">
                          <button
                            onClick={() => removeFromCart(item.barcode.toString())}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTimes />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ملخص الفاتورة */}
          <div className="mt-4 bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">الإجمالي:</span>
              <span className="font-medium">{subtotal.toFixed(2)} ج.م</span>
            </div>
            <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
              <span> قيمة الشحن :</span>
              <span>{delivary_price.toFixed(2)} ج.م</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200 font-bold text-lg">
              <span>المبلغ النهائي:</span>
              <span className="text-blue-600">{total.toFixed(2)} ج.م</span>
            </div>
          </div>
        </div>
      </div>

      {/* نموذج الفاتورة للطباعة */}
      <div >
        <div ref={invoiceRef} className="w-[80mm] p-2 text-sm font-sans">
          {/* شعار المحل */}
          <div className="text-center mb-2">
            <Image 
              src={logo} 
              alt="شعار المحل" 
              style={{ width: '60px', margin: '0 auto' }} 
            />
            <h2 className="text-lg font-bold">Merty inspiration</h2>
          </div>

          {/* بيانات الفاتورة */}
          <div className="text-center mb-3">
            <p className="text-xs">التاريخ: {new Date().toLocaleDateString('ar-EG')}</p>
            <p className="text-xs">رقم الفاتورة: {Math.floor(Math.random() * 100000)}</p>
          </div>

          {/* بيانات العميل */}
          <div className="mb-3 border-b pb-2 text-xs">
            <div className="flex justify-between">
              <span>اسم العميل:</span>
              <span>{watchCustomer('name') || 'غير محدد'}</span>
            </div>
            <div className="flex justify-between">
              <span>رقم التليفون:</span>
              <span>{watchCustomer('phone') || 'غير محدد'}</span>
            </div>
            <div className="flex justify-between">
              <span>العنوان:</span>
              <span className="text-left max-w-[60%]">{watchCustomer('address') || 'غير محدد'}</span>
            </div>
          </div>

          <table className="mb-4 w-full text-start">
            <thead className='text-center'>
              <tr className="border-b">
                <th className='text-start'>الصنف</th>
                <th className='w-[100px] text-start'>الكمية</th>
                <th>السعر</th>  
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.barcode}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  {/* <td>{(item.discountPrice || item.price).toFixed(2)}</td> */}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="border-t pt-2 text-sm">
            <div className="flex justify-between mb-1">
              <span>الإجمالي:</span>
              <span>{subtotal.toFixed(2)} ج.م</span>
            </div>
            <div className="flex justify-between mb-1">
              <span> قيمة الشحن :</span>
              <span>{delivary_price.toFixed(2)} ج.م</span>
            </div>
            <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
              <span>المجموع الكلي:</span>
              <span>{total.toFixed(2)} ج.م</span>
            </div>
          </div>

          <div className="text-center mt-3 text-xs">
            شكراً لتسوقكم معنا!
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashierSystem;