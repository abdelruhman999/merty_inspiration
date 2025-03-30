import type { FC } from 'react';
import {Routes, Routesfotter} from '../../assets/assests'
import Link from 'next/link';
import { FaFacebook } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";
interface FotterProps {}

const Fotter: FC<FotterProps> = () => {



return (
<footer className=" flex flex-col gap-[50px] w-full  bg-gray-800">
    <div className="w-full flex justify-between  mx-auto max-w-screen-xl p-4 md:items-center md:justify-between">
   
    <ul className=" text-end   text-sm font-medium text-gray-400 dark:text-gray-400 sm:mt-0">
        <li className="text-lg font-bold mb-3  text-gray-300"> الروابط السريعة</li>
      {
        
            Routes.map((el, index) => {
                return (
                    <li key={index} className='m-1' >
                    <Link className='hover:underline hover:text-white duration-200 me-4 md:me-6'  href={el.path}>
                      {el.name}
                    </Link>
                    </li>
                )
            })       
      }
    </ul>
    <div className='flex flex-col text-end text-sm font-medium text-gray-400 dark:text-gray-400 sm:mt-0'>

    <h3 className="text-lg font-bold mb-3 text-gray-300">معلومات الاتصال</h3>
    
    {
        
        Routesfotter.map((el, index) => {
            return (
                <p key={index} className='m-1' >                
                  {el.name}
                </p>
            )
        })       
  }
      
    </div>

    <div className='flex flex-col items-end gap-4 '>
    <h3 className="text-lg font-bold  text-gray-300">تابعنا على</h3>
    <div className='flex gap-4 cursor-pointer'>
    <Link href={"https://www.facebook.com/mertyinspiration?rdid=tNTOQ53NfoakWgtR&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1Q7JbhsJSV%2F#"}>
        <FaFacebook className='text-white text-2xl hover:text-blue-600 duration-200'/>
    </Link>
    <FaInstagramSquare className='text-white text-2xl hover:text-blue-600 duration-200'/>
    <FaTiktok className='text-white text-2xl hover:text-blue-600 duration-200'/>
    </div>
    </div>

    </div>
      <p className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023
         <a href="https://www.facebook.com/mertyinspiration?rdid=tNTOQ53NfoakWgtR&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1Q7JbhsJSV%2F#" className="hover:underline"> MERTY inspiration 5 </a>
         . جميع الحقوق محفوظه .
         </p>

</footer>

    );
}

export default Fotter;
