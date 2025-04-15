'use client';
export const dynamic = 'force-dynamic';
import Image from 'next/image';
import { FormEvent, useEffect, useState, type FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Swal from 'sweetalert2';
import Loaderimg from '@/component/Loaderimg';
import { sendRequest } from '@/api';
import useRequest from '@/hooks/call';
import { get_data, get_orders, get_response_from_createOrders } from '@/calls/constant';
import {  removeItemsAfterCreateOrder } from '@/redux/slices/dataShopping';
import { useRouter } from 'next/navigation';
import { additemstolocalstorage } from '@/redux/slices/orders';
import logo from '../../../assets/original-d775108071a243c7e9a96158fb2f0b54.webp'
import Link from 'next/link';


interface Create_orderProps {
    items: items[],
    first_name: string,
    last_name: string,
    phone_number: string,
    landmark:string ,
    address:string ,
    note: string,
    type:string,
    total_price: number ,
    delivery_price: number,
    city_id: number  
    active:number
    payment_method_id:string

}
interface items {
    size_color:number,
    quantity: number;
}
interface Cities {    
        id: number,
        name: string,
        delivery_price: number
}
interface Methods {
    id: number,
    name: string
}
export interface Response {
    uuid:string
    url:string
    type:string
}


const Create_order: FC<Create_orderProps> = () => {
    const router  = useRouter()
    const {itemsShopping , sup_total} = useSelector((state:RootState)=>state.dataShopping)
    const dispatsh = useDispatch()
    const [order, setOrder] = useState<Create_orderProps>({
        items: [],
        first_name:"",
        last_name:"",
        phone_number:'',
        landmark: "",
        address: "",
        note: "",
        type: "COD",
        total_price: 0,
        delivery_price: 0,
        city_id: 0,
        payment_method_id:'1',
        active:0
    });
   
    const {data:cities} = useRequest<Cities[]>({
        url:'/api/cities',
        method:'GET',    
    })
    const {data:payment_methods} = useRequest<Methods[]>({
        url:'/api/payment-methods',
        method:'GET',    
    })
    
    useEffect(()=>{
        if(payment_methods){
            console.log( payment_methods);
        }
    },[payment_methods])

    useEffect(()=>{
        if(itemsShopping.length > 0){
            console.log(itemsShopping);
           setOrder((prev)=>({
            ...prev,
            items: itemsShopping.map(el => ({size_color: el.id , quantity: el.count}))
        }));
    }
    },[itemsShopping])

   
  async function henddeleSubmit(e:FormEvent<HTMLFormElement>){
       e.preventDefault();
       if(isNaN(Number(order.phone_number))){
           Swal.fire('برجاء ادخال رقم صحيح')
           return
        }
        if(!order.first_name ){
         Swal.fire('برجاء ادخال الاسم الاول ')
         return
        }
        if(!order.last_name){
         Swal.fire('برجاء ادخال الاسم الاخير ')
         return
        }
        if(order.phone_number.length < 11 || order.phone_number.length > 11){
            Swal.fire('برجاء ادخال رقم صحيح')
            return
        }
        if(order.address === ''){
            Swal.fire(' يرجاء ادخال العنوان  ')
            return
        }
        if(order.delivery_price === 0){
            Swal.fire('برجاء اختيار المحافظة')
            return
        }
        if(order.items.length === 0){
            Swal.fire('برجاء اختيار منتج')
            return
        }
       


       await sendRequest<Response>({
            url:'/api/create-order',
            method:'POST',
            data:JSON.stringify(
              { 
                items: order.items,
                first_name:order.first_name ,
                last_name:order.last_name ,
                phone_number:order.phone_number ,
                landmark:order.landmark,
                address:order.address ,
                note:order.note,
                delivery_price: order.delivery_price,
                type: order.type,
                city: order.city_id
            }
            ),
            headers:{
              "Content-Type":"application/json"
            }
            }).then((res)=>{
                console.log(res);
                localStorage.setItem(get_response_from_createOrders ,JSON.stringify(res))
                dispatsh(additemstolocalstorage(itemsShopping))
                if(res.type === 'ONLINE'){
                    sendRequest<Response>({
                       url:'/api/get-payment-link',
                       method:"GET",
                       params:{
                           order_uuid:res.uuid,
                           payment_method_id:order.payment_method_id
                       }
                       }).then((res)=>{
                           window.open(res.url);
                       })
                }
                else{
                    Swal.fire({
                        icon: 'success',
                        title: 'تم عمل الأوردر بنجاح ✅',
                        showConfirmButton: false,
                        timer: 2000,
                      });
                      setTimeout(() => {
                        router.push('/orders'); 
                      }, 2000);
                }
                })

            localStorage.removeItem(get_data)
            dispatsh(removeItemsAfterCreateOrder())

    }
    return (
        <div className=' w-full max-sm:flex-col-reverse max-sm:gap-[20px] max-sm:items-center  flex justify-center'>

          {
          itemsShopping.length > 0 ?
          <>
          <form
            onSubmit={henddeleSubmit}
            className='
             w-[60%] max-sm:w-[100%]  pl-[50px]
             flex flex-col max-sm:pl-[15px] pt-[20px] gap-[30px]'>   
            <div className='flex flex-col gap-[10px]'>
            <label
            className='text-xl font-semibold '
            htmlFor="contact">
                Contact 
            </label>

            <input
                pattern='^01[0|1|2|5]\d{8}$'
                onChange={(e)=>{
                    setOrder((prev)=>({
                        ...prev,
                        phone_number: e.target.value
                    }))
                }}
            id='contact'
             type="text"
             placeholder='Please Enter Your Phone number'
             className='bg-white  pl-[15px] w-[90%] h-[42px] rounded outline-none'
             />
             </div>

          <div className='flex flex-col gap-[10px]'>

          <div className='flex flex-col gap'>
            <p className='text-xl font-semibold '>
                Delivery 
            </p>
            <p className='text-gray-400 text-sm'>This will also be used as your billing address for this order.</p>
          </div>
          <select 
          className='bg-white text-sm  
          pl-[15px] w-[90%] 
          h-[46px] rounded 
          '>
            <option>
               Egypt 
            </option>
          </select>
            </div>
            
            <div className='flex  items-center gap-[10px]'>
            <input
               onChange={(e)=>{
                setOrder((prev)=>({
                    ...prev,
                    first_name: e.target.value
                }))
            }}
             type="text" 
             placeholder='First name'
             className='bg-white  pl-[15px] w-[44%] h-[42px] rounded outline-none'
             />
            <input
               onChange={(e)=>{
                setOrder((prev)=>({
                    ...prev,
                    last_name: e.target.value
                }))
            }}
             type="text" 
             placeholder='Last name'
             className='bg-white  pl-[15px] w-[44%] h-[42px] rounded outline-none'
             />
            </div>
            <input
               onChange={(e)=>{
                setOrder((prev)=>({
                    ...prev,
                    address: e.target.value
                }))
            }}
             type="text" 
             placeholder='Address'
             className='bg-white  pl-[15px] w-[90%] h-[42px] rounded outline-none'
             />

             <div className='flex gap-[10px]'>
             <input
                onChange={(e)=>{
                    setOrder((prev)=>({
                        ...prev,
                        landmark: e.target.value
                    }))
                }}
             type="text" 
             placeholder='landmark'
             className='bg-white  pl-[15px] 
              h-[42px] rounded 
              outline-none w-[44%]'
             />
             <select
             onClick={(e)=>{
                 const ele = cities?.find((el)=> el.name === e.currentTarget.value)   
                 if(ele){
                     setOrder((prev)=>({
                        ...prev, 
                        delivery_price:ele.delivery_price,
                        city_id: ele.id
                     }))   
                 }
             }} 
             className='bg-white text-sm pl-[15px] w-[44%] h-[42px] rounded outline-none'>
            <option>
                Governate
            </option>
             {
             cities?.map((el)=>{
                return(
                    <option key={el.id}>
                        {el.name}
                    </option>
                )
             })
            }
             </select>
             </div>

             <textarea
             placeholder='Note (Optional)'
             className='bg-white  pl-[15px] pt-[15px] w-[90%] h-[150px] rounded outline-none'
             />
            <div className='flex gap-[15px] flex-col items-start'>
            <p className='text-xl font-semibold '>
            Shipping method 
            </p>
             <div className='flex text-sm  font-semibold pr-[20px] pl-[20px] w-[90%] bg-blue-100  rounded-lg h-[45px] justify-between items-center'>
                <p>توصيل للمنزل </p>
                <p>E£{order.delivery_price}</p>
             </div>
            </div>
            <div className='flex gap-[15px] flex-col items-start'>
                <div className='flex flex-col gap-1'>
                    <p className='text-xl font-semibold '>
                    Payment
                    </p>
                    <p className='text-sm text-gray-400 max-sm:w-[300px] w-[500px] text-wrap '>
                    Your payment method’s billing address must match the shipping address. All transactions are secure and encrypted.
                    </p>
                </div>
                <div className='w-[90%]'>
                <div
                onClick={()=>{
                    setOrder((prev)=>({
                        ...prev,
                          type:"COD"
                    }))
                }}
                className={`flex items-center
                 justify-start cursor-pointer rounded-tl-lg rounded-tr-lg
                   h-[45px] pl-[15px] duration-200
                  ${order.type === "COD" ? 'bg-blue-100 border-black/50 border' : 'bg-white'}
                  `}>
                    <div className='flex items-center gap-[10px]'>
                        <div className='border border-gray-100 rounded-full'>
                        <div className={`flex items-center duration-200 ${order.type === "COD" ? 'scale-100' : 'scale-0'} justify-center size-[20px] rounded-full bg-black`}>
                            <div className='bg-white rounded-full size-[40%]'></div>
                        </div>
                        </div>
                        <p>
                        Cash on Delivery (COD)
                        </p>
                    </div>
                </div>
                <div
                onClick={()=>{
                    setOrder((prev)=>({
                        ...prev,
                        type:"ONLINE"
                    }))
                }}
                className={`flex items-center
                 justify-start cursor-pointer
                   h-[45px] pl-[15px] duration-200
                  ${order.type === "ONLINE" ? 'bg-blue-100 border-black/50 border' : 'bg-white'}
                  `}>
                    <div className='flex items-center gap-[10px]'>
                        <div className='border border-gray-100 rounded-full'>
                        <div className={`flex items-center duration-200 ${order.type === "ONLINE" ? 'scale-100' : 'scale-0'} justify-center size-[20px] rounded-full bg-black`}>
                            <div className='bg-white rounded-full size-[40%]'></div>
                        </div>
                        </div>
                        <p>Credit card</p>
                    </div>
                </div>
                 <div className={` bg-white duration-300 pl-[15px]
                    ${order.type === "ONLINE" ? ' pt-[20px] pb-[15px] ' : 'h-0 '}
                    flex flex-col gap-[10px] items-start 
                    `}>
                        {
                            payment_methods && 
                            payment_methods.map((el,index)=>{
                                return(
                                <div
                                onClick={()=>{    
                                    setOrder((prev)=>({
                                        ...prev, 
                                        payment_method_id:String(el.id),
                                        active:index
                                    }))
                                }}
                                key={el.id}
                                className={`flex items-center gap-[10px] cursor-pointer   ${order.type === "ONLINE" ? '' : 'hidden'}`}>
                                    <div className='border border-gray-100 rounded-full  
                                    '>
                                        <div className={`flex items-center duration-200
                                             ${order.active === index ? 'scale-100' : 'scale-0'}
                                           
                                             justify-center size-[20px] rounded-full bg-black`}>
                                    <div className='bg-white rounded-full size-[40%]'></div>
                                        </div>
                                    </div>
                                    <p>{el.name}</p>
                                </div>
                                )
                            })
                        }
                 </div>
                </div>

            </div>
              
              <button
              type='submit'
              className=" bg-neutral-900 hover:bg-gray-800 duration-200 text-white font-bold py-4 px-8 rounded-lg cursor-pointer font-sans w-[90%]">
               Complete order
            </button>

            </form>

            <div className='w-[1px] max-sm:hidden bg-gray-50'></div>
             <div className='hidden max-sm:block h-[1px] bg-gray-50 w-[90%]'></div>               
            <div className=' max-sm:w-[100%] max-sm:pr-[20px] flex flex-col gap-[20px] pl-[20px] pt-[30px]  w-[40%] p-1'>
               {
             itemsShopping.length > 0 ?
                itemsShopping.map((el,index)=>{
                return(
                <div
                key={index}
                className=' max-sm:w-[100%] flex flex-col gap-[30px] w-[80%] p-1'>
                    <div className='w-full flex items-center justify-between '>
                        <div className='flex items-center justify-center gap-[10px]'>
                            <div className='relative'>
                            <Image
                            src={el.image}
                            alt='logo'
                            width={70}
                            height={200}
                            className='rounded-xl '
                            />
                            <div className='bg-gray-500 
                            size-[20px]
                             rounded-full flex 
                             items-center text-white
                              text-sm justify-center
                              absolute top-[-8px]
                               right-[-10px]'
                               >
                                {el.count}
                             </div>
                            </div>
                            <div>
                                <p className='text-sm font-semibold text-gray-900'>{el.name}</p>
                                <p className='text-sm font-semibold text-gray-400'>{el.sizeSelector}</p>
                            </div>
                        </div>
                        <div>
                            <p>E£{el.price}</p>
                        </div>
                    </div>
                </div>
                )
                }):
                <div className='w-full flex items-center justify-center h-[200px]'>
                    <Loaderimg/>
                </div>
               }

                <div className='w-[80%] max-sm:w-[100%] flex flex-col gap-[10px]'>

                   
                    <div className='w-full flex
                     items-center justify-between 
                     text-sm  text-gray-900'>
                     <p>Subtotal</p>
                     <p className='font-semibold'>E£{sup_total}</p>
                    </div>
                    <div className='w-full  flex 
                    items-center justify-between 
                    text-sm  text-gray-900'>
                     <p>Shipping</p>
                     <p className='font-semibold'>E£{order.delivery_price}</p>
                    </div>
                   
                    <div className='  flex 
                    items-center justify-between 
                    text-sm   text-gray-900'>
                     <p className='text-xl text-black font-semibold'>Total</p>
                     <p
                     className='text-xl font-bold '>E£{sup_total+order.delivery_price}
                     </p>
                    </div>
                </div>
            </div>
          </>: 
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

export default Create_order;
