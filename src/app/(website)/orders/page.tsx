'use client'
import { RootState } from '@/redux/store';
import { useEffect, useState, type FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import logo from '../../../../assets/original-d775108071a243c7e9a96158fb2f0b54.webp'
import Image from 'next/image';
import Link from 'next/link';
import {  get_response_from_createOrders } from '@/calls/constant';
import { take_Response_Create_Order_From_LocalStorage } from '@/redux/slices/response_from_createOrders';
import { add_uuid, setShow_payment } from '@/redux/slices/payment';
import { serve } from '@/api/utils';

interface OrdersProps {}

const Orders: FC<OrdersProps> = () => {

    const { items } = useSelector((state: RootState) => state.ResponseFromCreateOrders)
    const dispatch = useDispatch()

    useEffect(() => {
        const data = localStorage.getItem(get_response_from_createOrders) 
        if (data) {
            console.log(JSON.parse(data))
            dispatch(take_Response_Create_Order_From_LocalStorage(JSON.parse(data)))
        }
    }, [dispatch])

    return (
        <div className='w-full min-h-screen bg-gray-50 py-8 px-4 sm:px-6'>
            <div className='max-w-7xl mx-auto'>
                <div className='mb-8'>
                    <h1 className='text-2xl font-bold text-gray-900'>تاريخ الطلبات</h1>
                    <div className='bg-gray-300 w-full h-px mt-2'></div>
                </div>

 {items.length > 0 ? (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
    <tr>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
            المنتج
        </th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
            الصورة
        </th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
            الحجم
        </th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
            السعر
        </th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
            حالة الدفع
        </th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
            طريقة الدفع
        </th>
    </tr>
</thead>
<tbody className="bg-white divide-y divide-gray-200">
    {items.map((el) => (
        el.items.length > 0 &&
        el.items.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <Image
                        src={serve(item.size_color.color.image)}
                        alt={item.size_color.color.name || 'Product Image'}
                        width={60}
                        height={60}
                        className='h-15 w-15 object-contain rounded'
                    />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.size_color.size.size}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    LE {item.price.toLocaleString()}
                </td>
                    
                    
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {
                   el.type === 'ONLINE' ?
                     ( 
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                       ${el.is_paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {el.is_paid ? 'تم الدفع' : 'غير مدفوع'}
                    </span>
                     )
                     : 
                      <span className="px-2 inline-flex 
                        text-xs leading-5 
                        font-semibold rounded-full 
                        bg-green-100 text-green-800">
                          تم الدفع
                       </span>
                 }
                </td>

                <td className="px-6  py-4 whitespace-nowrap text-sm text-gray-500">
                    {
                     el.type === 'ONLINE' ? (
                      
                      !el.is_paid && (
                        <button 
                        onClick={()=>
                        {
                            dispatch(add_uuid(el.uuid))
                            dispatch(setShow_payment())
                        }
                        }
                            className="px-3 py-1 cursor-pointer bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                        >
                            دفع الآن
                        </button>
                        ) 
                    ):'Cash On Delivery'
                    
                    }
                </td>
            </tr>
        ))
    ))}
</tbody>
</table>
        </div>
            </div>
        ) : (
            <div className='flex flex-col items-center justify-center py-12 space-y-6'>
                <Image
                    src={logo}
                    alt='Mirty Inspiration Logo'
                    className='w-48 h-auto rounded-lg'
                    width={192}
                    height={192}
                />
                <p className='text-lg text-gray-600'>لا توجد طلبات سابقة</p>
                <Link
                    href={'/'}
                    className='bg-zinc-700 font-semibold text-white hover:bg-zinc-600 transition-colors duration-200 px-6 py-2 rounded-md'
                >
                    اكمل التسوق
                </Link>
            </div>
        )}
          </div>
        </div>
    )
}

export default Orders