
import Carousel from '@/component/Carousel';
import Pagination from '@/component/Pagination';
import Products from '@/component/Products';
import ProductsList from '@/component/ProductsList ';
import type { FC } from 'react';

export const metadata = {
    title: "Home Prodcut",
    description: "This is the home page of the website", 
  }
  
interface productProps {}

const product: FC<productProps> = ({}:productProps) => {
    return (
        <div className='w-full flex flex-col  items-center gap-[70px]'>
            <Carousel/>
            <div className=' flex flex-col gap-[50px] items-center '>
                <div className='flex flex-col max-sm:gap-[50px]'>
                <div className='flex max-sm:gap-[10px] flex-col gap-[20px]  items-start w-full '>
                    <p className='text-4xl max-sm:text-2xl pl-[10px] font-semibold'>All Collection</p>
                    <div className=' bg-gray-300 w-full h-[0.5px]'></div>
                </div>
                <div className="flex justify-center  max-sm:p-[0px] max-sm:gap-[10px] gap-[50px] flex-wrap w-full p-[50px]">
                    <Products/>
                    <ProductsList/>
                </div>
                </div>
                <Pagination/>
            </div>
        </div>
    );
}

export default product;
