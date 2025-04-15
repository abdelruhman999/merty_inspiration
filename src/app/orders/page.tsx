'use client'
import { RootState } from '@/redux/store';
import { useEffect, type FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import logo from '../../../assets/original-d775108071a243c7e9a96158fb2f0b54.webp'
import Image from 'next/image';
import Link from 'next/link';
import { get_orders } from '@/calls/constant';
import { takeItemsFormLocalStorage } from '@/redux/slices/orders';
interface OrdersProps {}

const Orders: FC<OrdersProps> = () => {
    const {items} = useSelector((state:RootState)=>state.ordersStorage)

    const dispatch = useDispatch()

    useEffect(()=>{
      const data = localStorage.getItem(get_orders)
      if(data){
        dispatch(
            takeItemsFormLocalStorage(JSON.parse(data))
        )
      }   
    },[])

  

    return (
        <div className='w-full  flex items-center justify-center  h-screen'>
        {
            items.length > 0 ?
            (
            <div className="relative w-full  p-[20px]  overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
                      <tr>
                          <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                              Product name
                          </th>
                          <th scope="col" className="px-6 py-3">
                              Image
                          </th>
                          <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                              Size
                          </th>
                          <th scope="col" className="px-6 py-3">
                              Price
                          </th>
                      </tr>
                  </thead>
                  <tbody>
                    {
                     items.length > 0 &&
                     items.map((el,index)=>{
                        return(
                      <tr
                      key={index}
                      className="border-b border-gray-200 dark:border-gray-700">
                          <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                              {el.name}"
                          </th>
                          <td className="px-6 py-4">
                              <Image
                                src={el.image}
                                alt='logo'
                                width={50}
                                height={50}
                                className='size-[50px]'
                              />
                          </td>
                          <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                              {el.sizeSelector}
                          </td>
                          <td className="px-6 py-4">
                          E£ {el.price}
                          </td>
                      </tr>

                        )
                     })
                    }
                   
                  </tbody>
              </table>
          </div>
            ) : 

            <div className='flex flex-col items-center gap-[20px]'>    
            <Image
                src={logo}
                alt='logo'
                className=' rounded-lg  object-contain'
                 />
            <Link 
               href={'/'}
               className='bg-zinc-700 font-semibold  text-white
                hover:bg-zinc-500 duration-200
                 cursor-pointer h-[35px] w-[200px] flex justify-center items-center'>
               Return To Shop
                </Link>
            </div>
    
        }   

        </div>

    );
}

export default Orders;
