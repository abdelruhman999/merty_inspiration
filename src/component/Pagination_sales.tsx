import useRequest from '@/hooks/call';
import { additems, setNext } from '@/redux/slices/dataDiscount';
import { incrementDiscount } from '@/redux/slices/dataDiscount';
import { RootState } from '@/redux/store';
import { Product } from '@/types/product';
import { useEffect, useState, type FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface Pgaination_SalesProps {

}

const Pgaination_Sales: FC<Pgaination_SalesProps> = () => {

      const {count , next } = useSelector((state:RootState)=>state.counterTow)
      const dispatch = useDispatch()

        const {data} = useRequest<Product>({
            url:'/api/products-with-discount',
            method:'GET',
            params:{
                page_size:String(count)
            }
        },[count])
    
        useEffect(()=>{
            if(data){
                dispatch(setNext(data.next))
                dispatch(additems(data.results)) 
            }
        },[data])

    return (
        <>
        { data &&
           next &&
            <div
            onClick={()=>{
               dispatch(incrementDiscount())
            }}
               className='text-sm cursor-pointer font-semibold 
               border-2 border-black p-[10px] text-gray-700
               hover:text-white duration-200 hover:bg-gray-900'>   
               اظهار الكل
               </div>
            
        }
        </>
    );
}

export default Pgaination_Sales;
