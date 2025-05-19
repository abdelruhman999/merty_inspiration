import Carousel from '@/component/Carousel';
import Pagination from '@/component/Pagination';
import Products from '@/component/Products';
import ProductsList from '@/component/ProductsList ';
import { PromoAlert } from '@/component/PromoAlert ';
import type { FC } from 'react';


const page: FC = async () => {
  return (
        <div className='w-full flex flex-col  items-center gap-[20px]'>
            <Carousel/>
            <div className="flex justify-center  max-sm:p-[0px] max-sm:gap-[10px] gap-[50px] flex-wrap w-full p-[50px]">
                {/* <Products/> */}
                <ProductsList/>
                <PromoAlert />
            </div>
                <Pagination />
        </div>
  );
};
export const metadata = {
  title: "Home Prodcut",
  description: "This is the home page of the website", 
}
export default page;
