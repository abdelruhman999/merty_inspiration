'use client';
import { useEffect, useState, type FC } from 'react';
import logo from '../../assets/logo.png'
import Image from 'next/image';
import Link from 'next/link';
import { FaCartShopping } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import {Routes} from '../../assets/assests'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { setShow } from '@/redux/slices/dataShopping';
import { FaList } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";


const Navper: FC = () => {
    const [active, setActive] = useState(0)
    const [bool , setBool] = useState(false)
    const {itemsShopping} = useSelector((state:RootState)=>state.dataShopping)
    const dispatsh = useDispatch()
    

    useEffect(()=>{
        console.log(bool);
        
    },[bool])
    return (
        <nav className=' bg-white sticky top-0 z-40 shadow flex items-center border-b-[0.2px] border-gray-100 justify-between max-sm:pl-[20px] max-sm:pr-[20px] pr-[40px] pl-[40px]  p-2 w-full'>
            <div className='flex items-center text-xl gap-4 cursor-pointer'>
                <div
                   onClick={()=>{
                    dispatsh(setShow())
                }}
                className='relative'>
                <FaCartShopping/>
                <div className='size-[16px] rounded-full bg-blue-600 flex items-center text-white text-xs justify-center absolute left-[-7px] top-[-10px]'>
                    {itemsShopping.length}
                </div>
                </div>
               
                  <Link
                  href={'/search'}
                  > 
                    <FaSearch/>
                  </Link>
              

            </div>
            <div className='max-sm:hidden flex items-center pt-[20px] flex-row-reverse font-semibold text-gray-500 gap-[20px]'>
                {
                    Routes.map((el, index) => {
                        return (
                            <Link
                            onClick={()=>setActive(index)}
                            className={`${active === index ? 'text-blue-600' : ''} hover:text-blue-600`}
                            key={index} href={el.path}>
                              {el.name}
                            </Link>
                        )
                    })
                }
            </div>
           

            <Link href={'/'} className='cursor-pointer'>
             <Image
             onClick={()=>setActive(0)}
             src={logo} alt="logo" width={70} height={70}/>
            </Link>

            
            <div className=' relative  hidden max-sm:block '>
                <div className={` ${bool? 'duration-500 -rotate-180' : 'duration-500 rotate--rotate-0'}`}>
                {
                    !bool ?
                    <FaList
                    onClick={()=>setBool(!bool)}
                    className="text-xl cursor-pointer"/>
                    :
                    <FaXmark
                    onClick={()=>setBool(!bool)}
                    className="text-xl cursor-pointer duration-200 hover:text-red-500"/>

                }

                </div>
            <div className={`absolute font-semibold text-gray-500
             gap-[20px] flex flex-col
              bottom-[-255px] left-[-130px]
               bg-white shadow-2xl rounded-xl
                w-[150px] p-[10px] duration-200
                ${bool ? 'opacity-100' :'scale-0'}
                `}>
                {
                    Routes.map((el, index) => {
                        return (
                            <Link
                            onClick={()=>
                            {
                                setBool(false)
                                setActive(index)
                            }
                            }
                            className={`${active === index ? 'text-blue-600' : ''} hover:text-blue-600`}
                            key={index} href={el.path}>
                              {el.name}
                            </Link>
                        )
                    })
                }
          
            </div>
            </div>
          

            
         
        </nav>
    );
}

export default Navper;
