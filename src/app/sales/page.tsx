'use client'
import Pgaination_Sales from '@/component/Pagination_sales';
import { useEffect, useState, type FC } from 'react';
import logo from '../../../assets/shutterstock_240940369-660x330.jpg'
import logo2 from '../../../assets/7640112.jpg'
import logo3 from '../../../assets/post_social_media_feed_consumer_week_with_discount_coupon.jpg'
import logo4 from '../../../assets/Social_media_feed_Instagram_holiday_deals_for_supermarkets.jpg'
import Image from 'next/image';
import useRequest from '@/hooks/call';
import ProductListSale from '@/component/ProductListSale';

interface SalesProps {}

const Sales: FC<SalesProps> = () => {
    
    return (
          <div className='flex  w-full flex-col items-center gap-[100px]'>
            <div className=' flex flex-col gap-[20px] items-center  w-full'>
            <Image
            src={logo}
            alt='logo'
            width={500}
            height={500}
            className='w-[100%] h-[550px]  mt-[-50px]'
            />
            <div className='flex justify-center w-[90%] gap-[30px]'>
            <Image
            src={logo2}
            alt='logo'
            width={500}
            height={500}
            className='w-[50%] max-sm:h-[250px] h-[510px]'
            />
            <div className='flex w-full flex-col gap-[10px]'>
            <Image
            src={logo3}
            alt='logo'
            width={500}
            height={500}
            className='w-[100%] max-sm:h-[120px] h-[250px]'
            />
             <Image
            src={logo4}
            alt='logo'
            width={500}
            height={500}
            className='w-[100%] max-sm:h-[120px] h-[250px]'
            />
            </div>
            </div>
            </div>

            <div className='flex gap-[50px]  flex-col  items-center w-full'>
                <div className='flex justify-center items-center gap-[10px] flex-wrap'>
              <ProductListSale/>
                </div>
              <Pgaination_Sales/>
            </div>
          </div>                
                            
                        
    
  
    );
}

export default Sales;
