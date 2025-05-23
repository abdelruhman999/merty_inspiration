'use client'
import { RootState } from '@/redux/store';
import { FormEvent, useEffect, useState, type FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setShow_payment } from '@/redux/slices/payment';
import { FaCreditCard, FaWallet, FaCheck, FaXmark } from 'react-icons/fa6';
import 'animate.css';
import useRequest from '@/hooks/call';
import Swal from 'sweetalert2';
import { sendRequest } from '@/api';
import { itemsType } from '@/redux/slices/response_from_createOrders';


interface paymentProps {
}
interface Methods {
    id: number,
    name: string
}
const Payment: FC<paymentProps> = () => {

    const dispatch = useDispatch();
    const { uuid } = useSelector((state: RootState) => state.show_payment)
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
    const {show_payment} = useSelector((state:RootState)=>state.show_payment)
    const {data:payment_methods} = useRequest<Methods[]>({
        url:'/api/payment-methods',
        method:'GET',    
    })

   



async function henddelePayment(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();

        if (!selectedMethod) {
            Swal.fire('يرجى اختيار طريقة الدفع');
            return;
        } 

       await sendRequest<itemsType>({
            url:'/api/get-payment-link',
            method:"GET",
            params:{
                order_uuid:uuid,
                payment_method_id:String(selectedMethodId)
            }
            }).then((res)=>{
                 
                window.open(res.url , '_blank');;
            })



  
    }


    return (
        <div className={`flex flex-col items-center justify-center  fixed left-0  bg-black/50 z-40 h-screen
               ${show_payment ? 'bg-black/50 w-full duration-200' : 'bg-transparent'}`}>
               
               <div className={`flex flex-col max-sm:gap-3 rounded-3xl max-sm:size-[370px] duration-200 bg-white gap-[20px] items-center size-[400px] transition-all 
                 ${show_payment ? "animate__animated animate__bounce animate__backInDown" : "hidden"}`}>
  
                <div className='flex pt-[10px] w-full justify-end pr-[10px]'>
                    <FaXmark
                    onClick={() => dispatch(setShow_payment())}
                    className='text-3xl text-blue-600 duration-500 hover:rotate-[180deg] hover:text-red-500 cursor-pointer'
                    />
                </div>

                <h2 className='text-2xl font-bold text-gray-800'>اختر طريقة الدفع</h2>
  
                <div className='w-full px-8 space-y-4'>
                    {
                        (payment_methods ?? []).length > 0 &&
                        (payment_methods ?? []).map((el)=>{
                            return(
                                <div 
                                key={el.id}
                                className={`flex gap-5 items-center p-4 border-2 rounded-xl cursor-pointer transition-all
                                ${selectedMethod === el.name ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                                onClick={() =>
                                {
                                    setSelectedMethodId(String(el.id))
                                    setSelectedMethod(el.name)
                                }

                                }
                                >
                                {el.name === 'card' ? <FaCreditCard className='text-3xl text-blue-600 ml-3'/> :<FaWallet className='text-3xl text-purple-600 ml-3' />}
                                    <div className='flex-1'>
                                        <h3 className='font-medium text-gray-800'>{el.name}</h3>
                                        {el.name === 'card' ?<p className='text-sm text-gray-500'>فيزا / ماستركارد / مدى</p> : <p className='text-sm text-gray-500'>حسابك على المنصة</p>}
                                    </div>
                                    {selectedMethod === el.name && <FaCheck className='text-green-500 text-xl' />}
                                </div>
                            )
                        })  
                    }
                    </div>
                    <button 
                        onClick={(e) => henddelePayment(e)}
                        className='mt-4 px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors'
                    >
                        تأكيد طريقة الدفع
                    </button>
       </div>
             </div>
    );
}

export default Payment;
