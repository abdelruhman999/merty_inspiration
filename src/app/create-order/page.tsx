import Image from 'next/image';
import type { FC } from 'react';
import  logo from '../../../assets/p_img13.png'

interface Create_orderProps {}

const Create_order: FC<Create_orderProps> = () => {
    return (
        <div className=' w-full flex  justify-center'>
          
          

            <form
            className='
            
             w-[50%]  pl-[50px]
             flex flex-col pt-[20px] gap-[30px]'>   

            <div className='flex flex-col gap-[10px]'>
            <label
            className='text-xl font-semibold '
            htmlFor="contact">
                Contact 
            </label>
            <input
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
             type="text" 
             placeholder='First name'
             className='bg-white  pl-[15px] w-[44%] h-[42px] rounded outline-none'
             />
            <input
             type="text" 
             placeholder='Last name'
             className='bg-white  pl-[15px] w-[44%] h-[42px] rounded outline-none'
             />
            </div>
            <input
             type="text" 
             placeholder='Address'
             className='bg-white  pl-[15px] w-[90%] h-[42px] rounded outline-none'
             />

             <div className='flex gap-[10px]'>
             <input
             type="text" 
             placeholder='City'
             className='bg-white  pl-[15px] 
              h-[42px] rounded 
              outline-none w-[44%]'
             />
             <select className='bg-white  pl-[15px] w-[44%] h-[42px] rounded outline-none'>
                <option value="cairo">cairo</option>
                <option value="cairo">alex</option>
             </select>
             </div>
              
            </form>

            <div className='w-[1px] bg-gray-50'></div>

            <div className=' pl-[20px] pt-[30px]  w-[50%] p-1'>
                <div className=' flex flex-col gap-[30px] w-[80%] p-1'>
                    <div className='w-full flex items-center justify-between '>
                        <div className='flex items-center justify-center gap-[10px]'>
                            <div className='relative'>
                            <Image
                            src={logo}
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
                                1
                             </div>
                            </div>
                            <div>
                                <p className='text-sm font-semibold text-gray-900'>Cookies Slides Basic T_Shirt</p>
                                <p className='text-sm font-semibold text-gray-400'>Black / M</p>
                            </div>
                        </div>
                        <div>
                            <p>E£149.00</p>
                        </div>
                    </div>
                    <div className=' flex flex-col gap-[10px]'>
                    <div className='w-full flex
                     items-center justify-between 
                     text-sm  text-gray-900'>
                     <p>Subtotal</p>
                     <p className='font-semibold'>E£149.00</p>
                    </div>
                    <div className='w-full  flex 
                    items-center justify-between 
                    text-sm  text-gray-900'>
                     <p>Shipping</p>
                     <p className='font-semibold'>E£65.00</p>
                    </div>
                    </div>
                    <div className='w-full  flex 
                    items-center justify-between 
                    text-sm   text-gray-900'>
                     <p className='text-xl text-black font-semibold'>Total</p>
                     <p className='text-xl font-bold '>E£214.00</p>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Create_order;
