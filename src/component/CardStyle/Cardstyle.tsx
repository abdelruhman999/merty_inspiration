'use client';
import Link from "next/link";
import { Suspense, useEffect, useState, type FC } from "react";
import style from "./Cardstyle.module.css";
import Image from "next/image";
import {Color} from "@/types/product";
import Loaderimg from "../Loaderimg";


interface CardstyleProps {
  image: string;
  name: string;
  id: number;
  colors:Color[]
  el:{
    sizes:[]
  }
  season:string

}

const Cardstyle: FC<CardstyleProps> = ({ image, name, colors , id , el ,season }: CardstyleProps) => {

  const [img , setImg] = useState(image)
  const [min_Cost , setMin_Cost] = useState<number>(0)


  useEffect(()=>{
        const sizes = el.sizes
        const min_value = Math.min(...sizes.map((el:any)=>el.price))
        setMin_Cost(min_value)
  },[])


  return (
    <div className={`${style.card} relative`}>
      <div className={style.wrapper}>
        <div>
        <Suspense  fallback={<Loaderimg/>}>
          {image &&
            <Image   
              className={`${style["card-image"]}  `}
              src={img}
              alt="logo"
              width={200}
              height={200}
            />  
          }
        </Suspense>
        </div>
      
    
        <div className={`${style["content"]}`}>
          <p className={style["title"]}>{name}</p>   
          <p className={`${style["title"]} ${style["price"]} ${style["old-price"]}`}>&nbsp;LE6</p>
          <p className={`${style["title"]} ${style["price"]}`}>LE{min_Cost?min_Cost : ''}</p>
          <p></p>
        </div>
        
        <div className={`${style.noScrollbar} overflow-y-hidden flex justify-center w-[150px] overflow-x-auto`}>

       <div className={` flex justify-center w-[220px] gap-2 `}>


          {colors.map((el , index: number) => {
            return (      
           
              <div
                key={index}
                onMouseEnter={()=>{
                const element =  colors.find((element)=> el.image == element.image)              
                  if(element){
                    setImg(element.image)
                  }        
              }}
             
               className="size-[30px] p-[2px]
               flex justify-center 
               items-center rounded-full 
               border-[1.5px] cursor-pointer
                border-[#c5b3b3]  hover:border-gray-800" 
               >
                 <Image
                 src={el.image}
                 alt="logo"
                 className="rounded-full  hover:scale-80 duration-200"
                 width={25}
                 height={25}
                 />     
               
              </div>
    

            
            );
          })}
        </div>

        </div>

      

        <Link
          href={`/product-details/${id}`}
          className={style["card-btn"]}
        >
          شاهد التفاصيل
        </Link>
      </div>

      <div className="bg-black absolute 
       w-[50px] h-[55px] 
       rounded-br-full
        top-0 left-0  flex items-center justify-center ">
           <p className="text-white pb-2  rotate-[-38deg]">
            {season}
           </p>
      </div>
    </div>
  );
};

export default Cardstyle;
