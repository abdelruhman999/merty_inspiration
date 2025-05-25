'use client';
import type { FC } from 'react';
import React, {  useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaQrcode, FaPrint, FaTimes } from 'react-icons/fa';
import { useRef, useState } from 'react';
import logo from '../../../../../../assets/logo.png';
import { imageToBase64 } from '../../../../../../assets/assests';
import { sendRequest } from '@/api';
import style from "./icons.module.css";
import Swal from 'sweetalert2';
import { FaInstagram, FaFacebookF, FaTiktok, FaGlobe, FaMapMarkerAlt } from "react-icons/fa";
import { useParams } from 'next/navigation';
import DeleteOrder from '../delete-order/DeleteOrder';



interface newResponse {
    paid_part: number;
    custom_discount: number;
    temp_total_price: number;
    address:string
    note:string
    items:insideItem[]
    total_price:number
    delivery_price:number
    first_name:string
    phone_number:string
    status: string;
    created_at: string;
    source: string;
    type: string;
    order_id:number;
    is_paid:boolean;
}
interface OrdersResponse {
    results: newResponse[];
    count: number;
}
interface insideItem{
price:number
quantity: number; 
size_color:ProductData
}

interface ProductData {
  id:number
  code: number;
  product:{
    name: string;
  }
  color: {
    id:number
    image?: string;
  };
  size: {
    id:number
    size: string;
    price: number;
  };
  discounts: discountData[];
  stock : number;
  total: number;
  quantity: number; 

}

interface discountData {
  discount: number;
}

interface CustomerData {
  paid_part: number;
  custom_discount: number;
  temp_total_price: number;
  note:string,
  name: string;
  phone: string;
  address: string;
  order_id:number;
  is_paid:boolean;
}



interface Create_orderProps {
    items: items[],
    source:string,
    status:string,
    type:string,
    order_id:number,
    is_paid:boolean;
}
interface items {
    size_color:number,
    quantity: number;
}

type OrderStatus = "PENDING" | "ONWAY" | "DELIVERED" | "CANCELLED";


const CashierSystem: FC = () => {
  const params = useParams()  
  const [logoBase64, setLogoBase64] = useState('');
  const [data, setData] = useState<ProductData | null>(null);
  const [showButtonPrint  , setShowButtonPrint] = useState<boolean>(true)
  const [stock, setStock] = useState<number>(0);
  const [cart, setCart] = useState<ProductData[]>([]);
  const [deliveryPrice, setDeliveryPrice] = useState<number>(0); 
  const [total, setTotal] = useState<number>(0); 
  const [subtotal, setSubtotal] = useState<number>(0); 
  const [order, setOrder] = useState<Create_orderProps>({
    items: [],
    source:"",
    status:"", 
    type:"",
    order_id:0,
    is_paid:false

  });
  const invoiceRef = useRef<HTMLDivElement>(null); 

  const { 
    register: registerProduct,
    setValue: setProductValue,
    watch: watchProduct,
    reset: resetProduct,
    formState: { errors: productErrors },
  } = useForm<ProductData>({ defaultValues: { quantity: 1 } });

  const { 
    register: registerCustomer,
    setValue: setCustmorValue,
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

  const fetchOrders = async (id: number) => {
      try {
          const response = await sendRequest<OrdersResponse>({
            url:`/api/orders?order_id=${id}`,
            method: 'GET',
            
          });
              console.log('res' , response.results);
          setOrder((prev)=>({
            ...prev,
            source:response.results[0].source,
            status:response.results[0].status, 
            type:response.results[0].type
          }))
          setCustmorValue('name',response.results[0].first_name)
          setCustmorValue('phone',response.results[0].phone_number)
          setCustmorValue('address',response.results[0].address)
          setCustmorValue('note',response.results[0].note)
          setCustmorValue('order_id',response.results[0].order_id)
          setCustmorValue('is_paid',response.results[0].is_paid)
          setCustmorValue('paid_part',response.results[0].paid_part)
          setCustmorValue('custom_discount',response.results[0].custom_discount)
          setCustmorValue('temp_total_price',response.results[0].temp_total_price)
          setOrder((prev)=>({
            ...prev,
            is_paid: response.results[0].is_paid,
          }))
          setDeliveryPrice(response.results[0].delivery_price)
      const newCartItems = response.results[0].items.map((el) => {
        console.log(el.size_color);
        const price = el.size_color.discounts.length > 0 
                      ? el.size_color.discounts[0].discount 
                      : el.size_color.size.price;
        
        const newItem: ProductData = {
          ...el.size_color,
          quantity: el.quantity,
          total: price * el.quantity
        };
        
        return newItem;
      });

      setCart(newCartItems);
                
      } catch (error) {
          console.error('Error fetching orders:', error);
      } 
  };

  useEffect(()=>{
    fetchOrders(Number(params.id))
  },[params.id])
      
  useEffect(() => {
    let timer : NodeJS.Timeout | undefined;
    const code = watchProduct("code");
    if (code) {
      console.log(code)

      timer = setTimeout(() => {
          console.log("hello")
          sendRequest<ProductData>({
              url: "/api/product/get-product-by-barcode",
              method: "GET",
              params: { barcode: String(code) },
          })
              .then((res) => {
                  setData(res);
                  console.log(res);
                  setProductValue("color", res.color);
                  setProductValue("size", res.size);
                  setProductValue("discounts", res.discounts);
                  setProductValue("quantity", 1);
                  setStock(res.stock);
              })
              .catch((error) => {
                  console.error("Error fetching product:", error);
              });
        }, 500);
    }
  return ()=> clearTimeout(timer);
}, [watchProduct("code")]);

   
   

async function CreateOrder() {
  const custmor = watchCustomer();

  if (!custmor.name) {
    Swal.fire("برجاء ادخال اسم العميل");
    return;
  }
  if (!custmor.phone) {
    Swal.fire("برجاء ادخال رقم الهاتف");
    return;
  }
  if (custmor.phone.length !== 11) {
    Swal.fire("برجاء ادخال رقم الهاتف صحيح");
    return;
  }
  if (!custmor.address) {
    Swal.fire("برجاء ادخال العنوان");
    return;
  }

 
  const { isConfirmed } = await Swal.fire({
    title: 'تأكيد عملية التعديل',
    html: `
      <div class="text-right">
        <p class="text-lg">هل تريد اتمام عملية التعديل؟</p>
        <hr class="my-3">
        <p class="text-gray-600">سيتم إنشاء الطلب وإرسال البيانات</p>
      </div>
    `,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'نعم، اتمام الدفع',
    cancelButtonText: 'لا، إلغاء',
    customClass: {
      confirmButton: 'bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md',
      cancelButton: 'bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md mr-2'
    }
  });


  if (!isConfirmed) {
    return;
  }

  try {
    const res = await sendRequest<newResponse>({
      url: `/api/update-order?order_id=${params.id}`,
      method: 'PUT',
      data: JSON.stringify({
        id: params.id,
        items: order.items,
        first_name: custmor.name,
        phone_number: custmor.phone,
        address: custmor.address,
        source: order.source,
        status: order.status,
        note: custmor.note,
        total_price: total,
        temp_total_price:custmor.temp_total_price, // سعر الاوردر كامل - الجزئ المدفوع
        custom_discount:custmor.custom_discount, // في حالة وجود خصم
        paid_part:custmor.paid_part,  // الجزء المدفوع 
        delivery_price: deliveryPrice,
        type: order.type,
        is_paid: custmor.is_paid,
        order_id: custmor.order_id,
      })
    });
    Swal.fire({
      title: 'تم تعديل الطلب بنجاح',
      text: `رقم الطلب: ${custmor.order_id}`,
      icon: 'success',
      confirmButtonText: 'حسناً',
      customClass: {
        confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md'
      }
    });
    console.log(res);
 
    
  } catch (error) {
    Swal.fire({
      title: 'خطأ',
      text: 'حدث خطأ أثناء إنشاء الطلب',
      icon: 'error'
    });
  }
}

// ..............................................

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
      const existingItemIndex = prevCart.findIndex(item => item.code == product.code)  ; 
      if (existingItemIndex >= 0) {
        const updatedCart = [...prevCart];       
       updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + product.quantity,
          total : (data.discounts.length > 0 ? data.discounts[0].discount : data.size.price) * 
                (updatedCart[existingItemIndex].quantity + product.quantity)
        };
        return updatedCart;
      } else {
        const newItem: ProductData = {
          ...data,
          quantity: product.quantity,
          total: price * product.quantity
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

  // ....................................................

 const handlePrint = async () => {
    const logoBase64 = await imageToBase64(logo.src);
    const imgSrc = logoBase64 || null;

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
      .logo{
        width : 50px
      }
      .tax-info {
        font-size: 10px;
        text-align: center;
        margin-top: 5px;
      }
      .complaints-info {
        font-size: 10px;
        text-align: center;
        margin-top: 3px;
      }
        .complaints-info {
        margin-top: 8px;
        padding-top: 8px;
        border-top: 1px dashed #ddd;
        text-align: center;
        font-size: 11px;
      }
      .complaints-info div {
        direction: ltr;
        display: inline-block;
        margin: 0 3px;
      }
      .phone-number {
        font-family: monospace;
      }
    </style>
  </head>
  <body>
    <!-- رأس الفاتورة -->
    <div class="header">
      <img 
        class="logo"
        src=${imgSrc} 
        alt="شعار المحل" 
        style={{ width: '60px', margin: '0 auto' }} 
      />
      <div class="shop-name">Merty inspiration</div>
      <div class="tax-info">الرقم الضريبي: 413-080-234</div>
      <div class="invoice-info">
        <div>التاريخ: ${new Date().toLocaleDateString("ar-EG")}</div>
        <div>رقم الفاتورة: ${watchCustomer("order_id")}</div>
      </div>
    </div>

    <!-- بيانات العميل -->
    <div class="customer-info">
      <div class="customer-name">
      <strong>اسم العميل:</strong> 
      <div>
        ${watchCustomer("name") || "غير محدد"}
      </div>
      </div>

      <div class="customer-name">
      <strong>رقم الهاتف:</strong> 
      <div>
        ${watchCustomer("phone") || "غير محدد"}
      </div>
      </div>
      <div class="customer-name">
        <strong>الحالة:</strong> 
        <div>
          ${watchCustomer("is_paid") ? " مدفوع" : "غير مدفوع"}
        </div>
      </div>

      <div class="customer-name">
      <strong>العنوان:</strong>
      <div>
        ${watchCustomer("address") || "غير محدد"}
      </div>
       </div>
      <div class="customer-name">
      <strong>الملاحطه:</strong>
      <div>
        ${watchCustomer("note") || " لا يوجد ملاحطه  "}
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
        ${cart
            .map(
                (item) => `
          <tr>
            <td>${item.product.name}</td>
            <td>${item.quantity}</td>
            <td>${(item.size.price || 0).toFixed(2)} ج.م</td>
          </tr>
        `
            )
            .join("")}
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
     <div class="total-row">
        <span>نسبة الخصم:</span>
        <span>${watchCustomer("custom_discount")} ج.م</span>
    </div>
      <div class="total-row">
        <span>تم دفع:</span>
        <span>${watchCustomer("paid_part").toFixed(2)} ج.م</span>
      </div>
      <div class="total-row grand-total">
        <span>المجموع الكلي:</span>
        <span>${watchCustomer('temp_total_price').toFixed(2)} ج.م</span>
      </div>
    </div>

    <!-- تذييل الفاتورة -->
  <div class="footer">
  شكراً لثقتكم بنا - نرجو زيارة متجرنا مرة أخرى
  <div class="complaints-info">
    للشكاوى والاقتراحات:<br>
    <span class="phone-number">010-0035-5808</span> - 
    <span class="phone-number">010-2645-6902</span> - 
    <span class="phone-number">012-2772-7874</span>
  </div>
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

    const printWindow = window.open("", "_blank");
    if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
    } else {
        alert("تعذر فتح نافذة الطباعة. يرجى تعطيل مانع النوافذ المنبثقة.");
    }
};

  
  const removeFromCart = (barcode: number) => {    
    setCart(prevCart => prevCart.filter(item => item.code !== barcode));
  };
  
  useEffect(()=>{
      if(cart.length > 0){
          console.log(cart);   
          setOrder((prev)=>({
          ...prev,
          items: cart.map(el => ({size_color: el.id , quantity: el.quantity}))
          }));
      }
      },[cart])

      useEffect(()=>{
        if(cart.length> 0){
          console.log(`cart` , cart);
          const subtotall = cart.reduce((sum, item) => sum + item.total, 0)
           const totalWithDiscount = (subtotall + deliveryPrice) - watchCustomer("custom_discount");
            console.log("totalWithDiscount", totalWithDiscount);
          setSubtotal(subtotall);
          setTotal(totalWithDiscount);

        }else{
            setSubtotal(0);
            setTotal(0);
            setCustmorValue("temp_total_price", 0);
            setCustmorValue("paid_part", 0);
            setCustmorValue("custom_discount", 0);
            setDeliveryPrice(0);
        }
    
  },[cart,deliveryPrice , watchCustomer("custom_discount")]);

   useEffect(()=>{
              const tep =( total - watchCustomer("paid_part"))
              setCustmorValue("temp_total_price", tep);
      },[total ,  watchCustomer("paid_part")])

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center"> الكاشير</h1>
     <DeleteOrder 
      orderId={watchCustomer('order_id')}
      onDelete={async () => {
        await sendRequest({
          url: `/api/delete-order?order_id=${params.id}`,
          method: 'DELETE',
        }).then(() => {
         setTimeout(() => {
           window.location.href = '/kashir/orders'; 
         }, 1000);
         
        })
      }}
      />
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
              className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
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
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">ملاحطه</label>
              <textarea
                {...registerCustomer('note')}
                rows={3}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  customerErrors.note ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                }`}
                placeholder=" اكتب ملاحطتك "
              />
              {customerErrors.note && (
                <span className="text-red-500 text-sm">{customerErrors.note.message}</span>
              )}
            </div>
        <div className="mb-3">
           <p className="block text-sm font-medium text-gray-700 mb-1"> اختر نوع المنتج </p>
          <ul className={style.wrapper}>
            <li
            onClick={()=>{
              setOrder((prev)=>({
                ...prev,
                source:"INSTAGRAM"
              }))
            }}
            className={`${style.icon} ${style.instagram} ${order.source === "INSTAGRAM" ? ' !bg-[#e4405f] text-white' : ''} `}>
              <span className={style.tooltip}>Instagram</span>
              <FaInstagram size="1.4em" />
            </li>

            <li
            onClick={()=>{
              setOrder((prev)=>({
                ...prev,
                source:"FACEBOOK"
              }))
            }}
            className={` ${style.icon} ${style.facebook} ${order.source === "FACEBOOK" ? '!bg-[#1877f2] text-white' : ''} `}>
              <span className={`${style['tooltip']}`}>Facebook</span>
              <FaFacebookF size="1.4em" />
            </li>

            <li
            onClick={()=>{
              setOrder((prev)=>({
                ...prev,
                source:"TIKTOK"
              }))
            }}
            className={`${style.icon} ${style.tiktok} ${order.source === "TIKTOK" ? '!bg-[#000000] text-white' : ''}`}>
              <span className={style.tooltip}>TikTok</span>
              <FaTiktok size="1.5em" />
            </li>


            <li
            onClick={()=>{
              setOrder((prev)=>({
                ...prev,
                source:"WEBSITE"
              }))
            }}
            className={`${style.icon} ${style.website} ${order.source === "WEBSITE" ? '!bg-[#4caf50] text-white' : ''}`}>
              <span className={style.tooltip}>Website</span>
              <FaGlobe size="1.4em" />
            </li>


            <li
            onClick={()=>{
              setOrder((prev)=>({
                ...prev,
                source:"HOTSPOT"
              }))
            }}
            className={`${style.icon} ${style.location} ${order.source === "HOTSPOT" ? '!bg-[#ff5722] text-white' : ''}`}>
              <span className={style.tooltip}>Location</span>
              <FaMapMarkerAlt size="1.4em" />
            </li>
          </ul>


      </div>

          </div>

          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h2 className="font-medium text-gray-700 mb-4">أوامر سريعة</h2>

           <div className="grid grid-cols-2 gap-3 m-1">

              <button
             onClick={handlePrint}
                disabled={cart.length === 0}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md bg-green-600 hover:bg-green-700 text-white`}
              >
                <FaPrint /> طباعة
              </button>
              <button
                onClick={() =>
                  { 
                    setCart([])
                   setShowButtonPrint(false)
                  }
                  }
                disabled={cart.length === 0}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md bg-red-600 hover:bg-red-700 text-white`}
              >
                <FaTimes /> إلغاء
              </button>
            </div>
            <button
            onClick={()=>{
              CreateOrder()
            }}
              className={`flex w-full  items-center justify-center gap-2 py-2 px-3 rounded-md ${
             'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
            >
              حفظ
            </button>
         
            
          </div>
        </div>

        {/* قسم السلة والفاتورة */}
        <div className="lg:col-span-2 flex flex-col gap-[10px]">
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
                    {cart.map((item,index) => (
                      <tr key={index}>
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
                        <td className="px-4 py-2 text-right font-medium">{item.total.toFixed(2) || 0} ج.م</td>
                        <td className="px-4 py-2 text-right">
                          <button
                            onClick={() => removeFromCart(item.code)}
                            className="text-red-500 cursor-pointer hover:text-red-700"
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

      <div className=' flex flex-col gap-[10px]'>

        <div className="flex  gap-5 pt-4">
        <span
        onClick={()=>{
          setOrder((prev)=>({
            ...prev,
            type:"COD"
          }))
        }}
        className={`px-3 hover:scale-110 ${order.type === "COD" ? 'scale-110 shadow border border-purple-800  ' : 'scale-90'} duration-200 cursor-pointer py-1.5 rounded-full text-sm bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1.5`}>
          💵 COD - دفع عند الاستلام
        </span>

        <span
        onClick={()=>{
          setOrder((prev)=>({
            ...prev,
            type:"ONLINE"
          }))
        }}
        className={`px-3 hover:scale-110 ${order.type === "ONLINE" ? 'scale-110 shadow border border-emerald-800 ' : 'scale-90'} duration-200 cursor-pointer py-1.5 rounded-full text-sm bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5`}>
          🌐 ONLINE - دفع إلكتروني
        </span>

        <span
        onClick={()=>{
          setOrder((prev)=>({
            ...prev,
            type:"HOTSPOT"
          }))
        }}
        className={`px-3 hover:scale-110 ${order.type === "HOTSPOT" ? 'scale-110 shadow border border-amber-800 ' : 'scale-90'} duration-200 cursor-pointer py-1.5 rounded-full text-sm bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1.5`}>
          📶 HOTSPOT - دفع محلي
        </span>
      </div>
          <div className=" flex items-center gap-5 pt-4">
            <div
            onClick={()=>{
                setCustmorValue('is_paid',true)
             
            }}
            className="flex items-center gap-2">
                <p className="text-gray-500 font-semibold">تم الدفع </p>
                <div className="flex cursor-pointer  items-center justify-center size-[20px] rounded-full border-2 border-gray-300">
                    <div className={` ${watchCustomer('is_paid') == true ? 'scale-100' : 'scale-0'} duration-200 bg-blue-500 size-[90%]  rounded-full`}></div>
                </div>
            </div>
            <div
                  onClick={()=>{
                    setCustmorValue('is_paid',false)
               
            }}
            className="flex items-center gap-2">
                <p className="text-gray-500 font-semibold"> لم يتم الدفع  </p>
                <div className="flex cursor-pointer  items-center justify-center size-[20px] rounded-full border-2 border-gray-300">
                    <div className={` ${watchCustomer('is_paid') == false ? 'scale-100' : 'scale-0'} duration-200 bg-blue-500 size-[90%]  rounded-full`}></div>
                </div>
            </div>
        </div>
      <select
         onClick={(e)=>{
          setOrder((prev)=>({
            ...prev,
            status:(e.target as HTMLSelectElement).value as OrderStatus 
          }))
         }} 
          className="mt-4 p-2 w-full outline-none border-2 border-gray-300 rounded-lg focus:ring-2 cursor-pointer focus:ring-blue-500">
          <option value="PENDING" className="bg-yellow-50 cursor-pointer">🟡 PENDING - قيد الانتظار</option>
          <option value="ONWAY" className="bg-blue-50 cursor-pointer">🚚 ONWAY - في الطريق</option>
          <option value="DELIVERED" className="bg-green-50 cursor-pointer">✅ DELIVERED - تم التوصيل</option>
           <option value="CANCELLED" className="bg-red-50 cursor-pointer">❌ CANCELLED - ملغي</option>
        </select>

      </div>
          {/* ملخص الفاتورة */}
          <div className="flex justify-between pt-[10px] items-center mb-2 text-sm text-gray-600">
                        <span> الخصم:</span>
                        <div className="flex items-center">
                            <input
                                type="number"
                                value={watchCustomer('custom_discount') || 0}
                               
                                   {
                                    ...registerCustomer("custom_discount", {
                                        min: {
                                            value: 0,
                                            message: "المبلغ المدفوع يجب أن يكون أكبر من أو يساوي 0",
                                        },  
                                        valueAsNumber: true,
                                    })
                                   }
                                min="0"
                                className="w-20 px-2 py-1 border border-gray-300 rounded-md text-right"
                            />
                            <span className="mr-2">ج.م</span>
                        </div>
                    </div>

                    <div className="flex justify-between pt-[10px] items-center mb-2 text-sm text-gray-600">
                        <span>المبلغ المدفوع:</span>
                        <div className="flex items-center">
                            <input
                                type="number"
                                value={watchCustomer('paid_part') || 0}
                               
                                   {
                                    ...registerCustomer("paid_part", {
                                        min: {
                                            value: 0,
                                            message: "المبلغ المدفوع يجب أن يكون أكبر من أو يساوي 0",
                                        },  
                                        valueAsNumber: true,
                                    })
                                   }
                                min="0"
                                className="w-20 px-2 py-1 border border-gray-300 rounded-md text-right"
                            />
                            <span className="mr-2">ج.م</span>
                        </div>
                    </div>

                    <div className="flex justify-between pt-[10px] items-center mb-2 text-sm text-gray-600">
                        <span>قيمة الشحن:</span>
                        <div className="flex items-center">
                            <input
                                type="number"
                                value={deliveryPrice}
                                onChange={(e) =>
                                    setDeliveryPrice(Number(e.target.value))
                                }
                                min="0"
                                className="w-20 px-2 py-1 border border-gray-300 rounded-md text-right"
                            />
                            <span className="mr-2">ج.م</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-gray-200 font-bold text-lg">
                        <span>المبلغ النهائي:</span>
                        <span className={`${ watchCustomer('temp_total_price') >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                            {( watchCustomer('temp_total_price')|| 0).toFixed(2)} ج.م
                        </span>
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
            <div className="flex justify-between">
              <span>ملاحطه:</span>
              <span className="text-left max-w-[60%]">{watchCustomer('note') || 'لا يوجد ملاحطه'}</span>
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
              {cart.map((item,index) => (
                <tr key={index}>
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