'use client'
import Image from 'next/image';
import {  useEffect, useState, type FC } from 'react';
import style from "../../component/CardStyle/Cardstyle.module.css";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Link from 'next/link';
import { removeItemsShopping, setItemsFromLocalStorage, setShow } from '@/redux/slices/dataShopping';
import { FaXmark } from "react-icons/fa6";
import logo1 from '../../../assets/master-173035bc8124581983d4efa50cf8626e8553c2b311353fbf67485f9c1a2b88d1.svg'
import logo2 from '../../../assets/visa-319d545c6fd255c9aad5eeaad21fd6f7f7b4fdbdb1a35ce83b89cca12a187f00.svg'
import logo3 from '../../../assets/3a0870c1369eb2bc105bd4838665defa.jpg'
import { TbShoppingBagX } from "react-icons/tb";
import { get_data } from '@/calls/constant';

interface ShoppingProps {}

const Shopping: FC<ShoppingProps> = () => {
  const [total_price , setTotal_price] = useState(0)
  const {itemsShopping,show} = useSelector((state:RootState)=>state.dataShopping)
  const dispatsh = useDispatch();


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const itemsFromLocalStorage = localStorage.getItem(get_data);
      if (itemsFromLocalStorage) {
        dispatsh(setItemsFromLocalStorage(JSON.parse(itemsFromLocalStorage)));
      }
    }
  }, [dispatsh]);


    useEffect(()=>{
        if(itemsShopping){
        const price =  itemsShopping.reduce((prev,current)=> prev + current.price , 0)
        setTotal_price(price);   
        }  
    },[itemsShopping])

    return (
      <div className={`flex flex-col items-start fixed left-0 top-[87px] bg-black/50 z-40 h-screen
        ${show ? 'bg-black/50 w-full duration-500' : 'bg-transparent'}`}>
        
        <div className={`flex flex-col bg-white gap-[20px]  items-center h-screen transition-all 
          ${show ? "w-[350px]  duration-1000 overflow-hidden" : "w-0"}`}>
          
          <div className={` flex  w-full items-center  
           p-[10px]  ${show ? 'bg-zinc-700 duration-1000' :'duration-50'}
            gap-[70px]   justify-end`}
            >
            <p className="text-white font-semibold text-3xl text-nowrap  self-center ">
              Sopping cart
            </p>
            <FaXmark
              onClick={() => dispatsh(setShow())}
              className='text-2xl text-blue-600 duration-500 hover:rotate-[180deg] hover:text-red-500 cursor-pointer'
            />
          </div>
          

            {itemsShopping.length > 0 ? (
              <div className={`flex flex-col gap-[20px]   pb-[87px] w-full h-full  overflow-y-auto no-scrollbar ${!show && 'hidden'}`}>
                <div className="w-full h-full  overflow-y-auto no-scrollbar flex flex-col gap-[20px]">
               { 
               itemsShopping.map((el, index) => (
                  <div key={index} className='flex flex-col gap-[20px] items-center w-full'>
                    <div className={`gap-[30px] ${show ? 'w-fit' : 'w-0'} flex justify-end items-center`}>
                      <div className='flex flex-col items-end gap-[10px]'>
                        <p className={style["title"]}>{el.name}</p>  
                        <div className='flex flex-row-reverse'>
                          <p className={`${style["title"]} ${style["price"]} ${style["old-price"]} text-lg`}>&nbsp;LE6</p>
                          <p className={`text-red-500 font-semibold text-lg`}>LE{el.price}</p>
                        </div> 
          
                        <div className='border border-black w-[120px] h-[40px] gap-[20px] flex items-center justify-center rounded-2xl'>
                          <FaPlus className='text-xl font-semibold cursor-pointer' />
                          <p className='text-[17px]'>1</p>
                          <FaMinus className='text-xl font-semibold cursor-pointer' />
                        </div>
          
                        <p className="text-lg font-medium text-gray-700">
                          <span className="text-xl font-bold text-blue-600">{el.sizeSelector}</span> : المقاس
                        </p>
          
                        <div className='flex gap-[10px] items-center justify-center pr-3'>
                          <MdDelete
                            onClick={() => dispatsh(removeItemsShopping(index))}
                            className='text-red-500 text-xl cursor-pointer'
                          />
                          <Link href={`${el.id}`}>
                            <FaRegEdit className='text-blue-600 text-xl cursor-pointer'/>
                          </Link>
                        </div>
                      </div>
          
                      <div className='flex gap-[20px]'>
                        <Image
                          src={el.image || "/default-image.jpg"}
                          alt='logo'
                          width={150}
                          height={200}
                          className='bg-white'
                        /> 
                      </div>
                    </div>
                    <div className='bg-gray-200 h-[0.5px] w-full'></div>
                  </div>
                  
                ))
                }
                </div>
                <div className='bg-white pb-3 pt-3 shadow  shadow-gray-400 gap-[20px] flex flex-col items-center   w-full '>
                    <div className='flex items-center justify-between w-full p-1.5'>
                      <p className='text-xl font-semibold text-zinc-700'>LE {total_price} EGP</p>
                      <p className='text-xl font-semibold text-zinc-700'>:Subtotal</p>
                    </div>
                    <div className='bg-zinc-700  text-white hover:bg-zinc-500 duration-200 cursor-pointer h-[35px] w-[90%] flex justify-center items-center'>
                    CHEAK OUT
                    </div>
                    <div className='flex justify-center items-center gap-[10px]'>
                    <Image
                          src={logo1 }
                          alt='logo'
                          width={50}
                          height={200}
                          className=''
                        /> 
                    <Image
                          src={logo2 }
                          alt='logo'
                          width={50}
                          height={200}
                          className=''
                        /> 
                    <Image
                          src={logo3 }
                          alt='logo'
                          width={50}
                          height={200}
                          className=' rounded'
                        /> 
                    </div>
                </div>
              </div>
            ) : (
              <div className={`${!show&& 'hidden'}  w-full text-nowrap
               flex flex-col
                items-center justify-center
                  h-screen gap-[10px]`}>
                <TbShoppingBagX  className='text-5xl'/>
               <p>Your cart is empty.</p>
               <Link 
               onClick={()=>{
                dispatsh(setShow())
               }}
               href={'/'}
               className='bg-zinc-700 font-semibold  text-white
                hover:bg-zinc-500 duration-200
                 cursor-pointer h-[35px] w-[200px] flex justify-center items-center'>
               Return To Shop
                </Link>
              </div>
            )}
           
         
         
        </div>
      </div>
    );
}

export default Shopping;
