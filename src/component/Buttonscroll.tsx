"use client";
import type { FC } from 'react';
import { MdKeyboardDoubleArrowUp } from "react-icons/md";

interface ScrollbuttonProps {}

const Scrollbutton: FC<ScrollbuttonProps> = () => {
    
    return (
          <button
                    onClick={()=>{window.scrollTo({
                        top:0,
                        behavior:'smooth'
                    })}}
                    className='bg-black
                     shadow-sky-500
                      shadow-md cursor-pointer
                       text-center 
                     w-[60px] p-[15px] rounded'>
                       <MdKeyboardDoubleArrowUp className='text-white  animate-bounce text-3xl' />
                    </button>
    );
}

export default Scrollbutton;
