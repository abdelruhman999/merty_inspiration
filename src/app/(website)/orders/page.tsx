'use client'
import { RootState } from '@/redux/store';
import { useEffect, type FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import logo from '../../../../assets/original-d775108071a243c7e9a96158fb2f0b54.webp'
import Image from 'next/image';
import Link from 'next/link';
import { get_orders } from '@/calls/constant';
import { takeItemsFormLocalStorage } from '@/redux/slices/orders';

interface OrdersProps {}

const Orders: FC<OrdersProps> = () => {
    const { items } = useSelector((state: RootState) => state.ordersStorage)
    const dispatch = useDispatch()

    useEffect(() => {
        const data = localStorage.getItem(get_orders)
        if (data) {
            dispatch(takeItemsFormLocalStorage(JSON.parse(data)))
        }
    }, [dispatch])

    return (
        <div className='w-full min-h-screen bg-gray-50 py-8 px-4 sm:px-6'>
            <div className='max-w-7xl mx-auto'>
                <div className='mb-8'>
                    <h1 className='text-2xl font-bold text-gray-900'>Order History</h1>
                    <div className='bg-gray-300 w-full h-px mt-2'></div>
                </div>

                {items.length > 0 ? (
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Product
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Image
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Size
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Price
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {items.map((el, index) => (
                                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {el.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Image
                                                    src={el.image}
                                                    alt={el.name}
                                                    width={60}
                                                    height={60}
                                                    className='h-15 w-15 object-contain rounded'
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {el.sizeSelector}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                E£ {el.price.toLocaleString()}
                                            </td>
                                        </tr>
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
                        <p className='text-lg text-gray-600'>You haven't placed any orders yet</p>
                        <Link
                            href={'/'}
                            className='bg-zinc-700 font-semibold text-white hover:bg-zinc-600 transition-colors duration-200 px-6 py-2 rounded-md'
                        >
                            Continue Shopping
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Orders