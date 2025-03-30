
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
        <div className='w-full flex flex-col  items-center gap-[20px]'>
            <Carousel/>
            <div className="flex justify-center gap-[50px] flex-wrap w-full p-[50px]">
                <Products/>
                <ProductsList/>
            </div>
                <Pagination />
        </div>
    );
}

export default product;
