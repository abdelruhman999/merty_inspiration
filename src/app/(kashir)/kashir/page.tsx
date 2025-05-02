'use client';
import type { FC } from 'react';
import React, {  useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaQrcode, FaPrint, FaTimes } from 'react-icons/fa';
import { useRef, useState } from 'react';
import logo from '../../../../assets/logo.png';
import { imageToBase64 } from '../../../../assets/assests';
import { sendRequest } from '@/api';
import Swal from 'sweetalert2';


interface ProductData {
  code: string;
  product:{
    name: string;
  }
  color: {
    
    image?: string;
  };
  size: {
    size: string;
    price: number;
  };
  discounts: discountData[];
  quantity: number; 
  stock : number;
}

interface discountData {
  discount: number;
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

  const [logoBase64, setLogoBase64] = useState('');
  const [data, setData] = useState<ProductData | null>(null);
  const [stock, setStock] = useState<number>(0);
  const [cart, setCart] = useState<InvoiceItem[]>([]);
  const [deliveryPrice, setDeliveryPrice] = useState<number>(0); 
  const [isPrinting, setIsPrinting] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null); 
  
  const { 
    register: registerProduct,
    handleSubmit: handleProductSubmit,
    setValue: setProductValue,
    watch: watchProduct,
    reset: resetProduct,
    formState: { errors: productErrors },
  } = useForm<ProductData>({ defaultValues: { quantity: 1 } });

  const { 
    register: registerCustomer,
    handleSubmit: handleCustomerSubmit,
    setValue: setCustomerValue,
    watch: watchCustomer,
    formState: { errors: customerErrors },
  } = useForm<CustomerData>();

  useEffect(() => {
    const loadLogo = async () => {
      const base64 = await imageToBase64(logo.src);
      setLogoBase64(base64);
    };
    loadLogo();
  }, []);

  
  useEffect(() => {
    const code = watchProduct('code');
    if (code && code.length >= 12) {
      sendRequest<ProductData>({
        url: '/api/product/get-product-by-barcode',
        method: 'GET',
        params: { barcode: String(code) },
      }).then((res) => {
        setData(res);
        setProductValue('color', res.color);
        setProductValue('size', res.size);
        setProductValue('discounts', res.discounts);
        setProductValue('quantity', 1);
        setStock(res.stock);
      }).catch(error => {
        console.error('Error fetching product:', error);
      });
    }
  }, [watchProduct('code')]);

const addToCart = () => {
    const product = watchProduct();
    if (!product.code || !data) return;
    if (product.quantity > stock) {
      Swal.fire({
        title: 'خطأ في الكمية',
        html: `
          <div class="text-right">
            <p class="text-lg">الكمية المطلوبة (${product.quantity}) أكبر من الكمية المتاحة (${stock})</p>
            <hr class="my-3">
            <p class="text-gray-600">الرجاء تعديل الكمية أو مراجعة المخزون</p>
          </div>
        `,
        icon: 'error',
        confirmButtonText: 'حسناً',
        customClass: {
          confirmButton: 'bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md'
        }
      });      return;
    }
    if (product.quantity < 1) {
      Swal.fire('الكمية يجب أن تكون أكبر من 0');
      return;
    }
    const price = data.discounts.length > 0 
      ? data.discounts[0].discount 
      : data.size.price;
    
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.code === product.code);
      
      if (existingItemIndex >= 0) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + product.quantity,
          total: (data.discounts.length > 0 ? data.discounts[0].discount : data.size.price) * 
                (updatedCart[existingItemIndex].quantity + product.quantity)
        };
        return updatedCart;
      } else {
        const newItem: InvoiceItem = {
          ...data,
          quantity: product.quantity,
          total: price * 1
        };
        return [...prevCart, newItem];
      }
    });

    // إعادة تعيين النموذج
    resetProduct({ 
      quantity: 1 
    });
    setData(null);
  };

  const handlePrint = async () => {
    const logoBase64 = await imageToBase64(logo.src);
    const imgSrc = logoBase64 || null; // سيستخدم null إذا كان logoBase64 فارغًا
    
    const printContent = `
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="utf-8">
        <title>فاتورة مبيعات</title>
        <style>
          @page {
            size: 80mm;
            margin: 0;
          }
          * {
            box-sizing: border-box;
            font-family: 'Arial', sans-serif;
          }
          body {
             width: 80mm !important;
            -webkit-print-color-adjust: exact; 
            print-color-adjust: exact;
            margin: 0 auto;
            padding: 5mm;
            color: #000;
            line-height: 1.4;
          }
          .header {
            text-align: center;
            margin-bottom: 8px;
            padding-bottom: 8px;
            border-bottom: 1px dashed #ddd;
          }
          .logo {
            width: 60px;
            height: auto;
            margin: 0 auto 5px;
            display: block;
          }
          .shop-name {
            font-size: 18px;
            font-weight: bold;
            margin: 5px 0;
          }
          .invoice-info {
            font-size: 12px;
            margin-bottom: 10px;
          }
          .customer-info {
            margin-bottom: 10px;
            padding-bottom: 8px;
            border-bottom: 1px dashed #ddd;
            font-size: 12px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
            font-size: 12px;
          }
          th {
            padding: 5px;
            text-align: right;
            border-bottom: 1px solid #ddd;
          }
          td {
            padding: 5px;
            text-align: right;
            border-bottom: 1px dashed #eee;
          }
          .totals {
            margin-top: 10px;
            padding-top: 8px;
            border-top: 1px dashed #ddd;
            font-size: 13px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
          }
          .grand-total {
            font-weight: bold;
            font-size: 14px;
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px solid #000;
          }
          .footer {
            text-align: center;
            margin-top: 15px;
            font-size: 11px;
            color: #666;
          }
          .customer-name{
          display: flex;
          justify-content: space-between;
          }
        </style>
      </head>
      <body>
        <!-- رأس الفاتورة -->
        <div class="header">
          <img 
            src={imgSrc} 
            alt="شعار المحل" 
            style={{ width: '60px', margin: '0 auto' }} 
          />
          <div class="shop-name">Merty inspiration</div>
          <div class="invoice-info">
            <div>التاريخ: ${new Date().toLocaleDateString('ar-EG')}</div>
            <div>رقم الفاتورة: INV-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}</div>
          </div>
        </div>
  
        <!-- بيانات العميل -->
        <div class="customer-info">
          <div class="customer-name">
          <strong>اسم العميل:</strong> 
          <div>
            ${watchCustomer('name') || 'غير محدد'}
          </div>
          </div>

          <div class="customer-name">
          <strong>رقم الهاتف:</strong> 
          <div>
            ${watchCustomer('phone') || 'غير محدد'}
          </div>
          </div>

          <div class="customer-name">
          <strong>العنوان:</strong>
          <div>
            ${watchCustomer('address') || 'غير محدد'}
          </div>
           </div>
        </div>
  
        <!-- تفاصيل الفاتورة -->
        <table>
          <thead>
            <tr>
              <th>الصنف</th>
              <th>الكمية</th>
              <th>السعر</th>
            </tr>
          </thead>
          <tbody>
            ${cart.map(item => `
              <tr>
                <td>${item.product.name}</td>
                <td>${item.quantity}</td>
                <td>${(item.size.price || 0).toFixed(2)} ج.م</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
  
        <!-- المجموع -->
        <div >
          <div class="total-row">
            <span>الإجمالي:</span>
            <span>${subtotal.toFixed(2)} ج.م</span>
          </div>
          <div class="total-row">
            <span>قيمة الشحن:</span>
            <span>${deliveryPrice.toFixed(2)} ج.م</span>
          </div>
          <div class="total-row grand-total">
            <span>المجموع الكلي:</span>
            <span>${total.toFixed(2)} ج.م</span>
          </div>
        </div>
  
        <!-- تذييل الفاتورة -->
        <div class="footer">
          شكراً لثقتكم بنا - نرجو زيارة متجرنا مرة أخرى
        </div>
  
        <script>
          setTimeout(() => {
            window.print();
            window.close();
          }, 300);
        </script>
      </body>
      </html>
    `;
  
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
    } else {
      alert('تعذر فتح نافذة الطباعة. يرجى تعطيل مانع النوافذ المنبثقة.');
    }
  };


  // useEffect(()=>{
  //   if(cart.length > 0){
  //    console.log('cart', cart);
  //   }
  // },[cart])

  

  // إزالة منتج من السلة
  const removeFromCart = (barcode: string) => {
    setCart(prevCart => prevCart.filter(item => item.code !== barcode));
  };

  // حساب الإجماليات
  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const delivary_price = 150; 
  const total = subtotal + deliveryPrice;

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
                  {...registerProduct('code', { required: 'مطلوب' })}
                  className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    productErrors.code ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
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
                      value={
                        data && (data.discounts ?? []).length > 0 && data.discounts[0]?.discount != null
                          ? data.discounts[0].discount
                          : data?.size?.price ?? 0
                      }
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
             onClick={handlePrint}
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
                      <tr key={item.code}>
                        <td className="px-4 py-2 text-right">
                          <div className="font-medium">{item.product.name}</div>
                          <div className="text-xs text-gray-500">{item.code}</div>
                        </td>
                        <td className="px-4 py-2 text-right">
                          {item.discounts.length > 0 ? (
                            <>
                              <span className="line-through text-gray-400 text-sm">{item.size.price} ج.م</span>
                              <br />
                              <span className="text-red-600">{item.discounts[0].discount} ج.م</span>
                            </>
                          ) : (
                            <span>{item.size.price} ج.م</span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-right">{item.quantity}</td>
                        <td className="px-4 py-2 text-right font-medium">{item.total.toFixed(2)} ج.م</td>
                        <td className="px-4 py-2 text-right">
                          <button
                            onClick={() => removeFromCart(item.code)}
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
          <div className="flex justify-between pt-[10px] items-center mb-2 text-sm text-gray-600">
          <span>قيمة الشحن:</span>
          <div className="flex items-center">
            <input
              type="number"
              value={deliveryPrice}
              onChange={(e) => setDeliveryPrice(Number(e.target.value))}
              min="0"
              className="w-20 px-2 py-1 border border-gray-300 rounded-md text-right"
            />
            <span className="mr-2">ج.م</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-gray-200 font-bold text-lg">
          <span>المبلغ النهائي:</span>
          <span className="text-blue-600">{(subtotal + deliveryPrice).toFixed(2)} ج.م</span>
        </div>

        </div>
      </div>


      {/* نموذج الفاتورة للطباعة */}
      <div >
        <div
       ref={invoiceRef}
        className="w-[80mm] p-2 text-sm font-sans"
        style={{ display: 'none' }}
  >
          {/* شعار المحل */}
          <div className="text-center mb-2">
          {logoBase64 && (
              <img 
                src={logoBase64} 
                alt="شعار المحل" 
                style={{ width: '60px', margin: '0 auto' }} 
              />
            )}
            <h2 className="text-lg font-bold">Merty inspiration</h2>
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
                <tr key={item.code}>
                  <td>{item.product.name}</td>
                  <td>{item.quantity}</td>
                  <td>{(item.size.price || 0).toFixed(2)}</td>
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
              <span>{deliveryPrice.toFixed(2)} ج.م</span>
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