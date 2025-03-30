'use client'
import { sendRequest } from '@/api';
import { increment, incrementRequest, setNext } from '@/redux/slices/count';
import { addItems } from '@/redux/slices/dataSlice';
import { RootState } from '@/redux/store';
import { Pagination as Result } from '@/types/base';
import { HomeProduct } from '@/types/product';
import { useEffect, type FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';


interface PaginationProps {}

const Pagination: FC<PaginationProps> = () => {
    const dispatch = useDispatch();
    const {lastrequest,count,next} = useSelector((state:RootState)=>state.count);
    
  
    useEffect(()=>{
            if(count > lastrequest){
                sendRequest<Result<HomeProduct>>({
                    url:'/api/products',
                    method:'GET',
                    params:{
                        page:String(count),   
                    }
                }).then((res)=>{
                    dispatch(setNext(res.next));
                    dispatch(addItems(res.results)); 
                }).catch((err)=>{
                    console.log(err);
                }).finally(()=>{
                    dispatch(incrementRequest());
                })
            }
        
    },[count])
   
    return (
     
            <>
                { next &&
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
