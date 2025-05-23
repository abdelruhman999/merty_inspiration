'use client'
import useRequest from '@/hooks/call';
import { increment, setNext } from '@/redux/slices/count';
import { addItems } from '@/redux/slices/dataSlice';
import { RootState } from '@/redux/store';
import { Pagination as Result } from '@/types/base';
import { HomeProduct } from '@/types/product';
import { useEffect, useState, type FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';


interface PaginationProps {}

const Pagination: FC<PaginationProps> = () => {
    const dispatch = useDispatch();
    const {count,next} = useSelector((state:RootState)=>state.count);

    
    const {data} = useRequest<Result<HomeProduct>>({
        url:'/api/products',
        method:'GET',
        params:{
            page:String(count),
            page_size:"20"
        }
    },[count])

    useEffect(() => {
        if (data) {
            dispatch(setNext(data.next));
            dispatch(addItems(data.results));
            console.log(data);  
        }       
    }, [data, dispatch]);

    return (
     
            <>
                { data && data.results.length>0 && next &&
                        <div
                        onClick={()=>{
                            dispatch(increment());
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

export default Pagination ;
