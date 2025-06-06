'use client';
import Link from "next/link";
import { Suspense, useEffect, useState, type FC } from "react";
import style from "./Cardstyle.module.css";
import Image from "next/image";
import {Color} from "@/types/product";
import Loaderimg from "../Loaderimg";
import logo from "../../../assets/p_img13.png";
import { Base_Url } from "@/calls/constant";
import { size } from "lodash";
import { serve } from "@/api/utils";
import ImageWithLoader from "../ImageWithLoader";


export interface CardstyleProps {
  image: string;
  name: string;
  id: number;
  colors:Color[]
  el:{
    sizes:PriceType[]
  }
  season:string

}

interface PriceType{
discount: number
price: number
size: string

}


const Cardstyle: FC<CardstyleProps> = ({ image, name, colors , id , el ,season }: CardstyleProps) => {

  const [img , setImg] = useState(image)
  const [min_Cost , setMin_Cost] = useState<number>(0)
  const [oldPrice , setOldPrice] = useState<number>(0)


  useEffect(()=>{
        const sizes = el.sizes   
        const sizes_with_diff = sizes.map((el)=> {
          return {
            ...el,
            diff: el.price - el.discount
          }
        } )     
        const min_value = sizes.length > 0 ? Math.min(...sizes_with_diff.map((el)=> el.diff )) : 0 ;
        sizes_with_diff.map((el)=>{
          if (el.diff === min_value) {
            setOldPrice(el.price)
          }
        })

        setMin_Cost(min_value)
  },[])


  return (
    <div className={`${style.card} relative`}>
      <div className={style.wrapper}>
        <div>
          {
            colors.length > 0 &&
       
            <ImageWithLoader   
              className={`${style["card-image"]}`}
              src={`${serve(img)}`}
              alt="logo"
              width={200}
              height={200}
            />  
     
          }
        </div>
      
    
        <div className={`${style["content"]}`}>
          <p className={`${style["title"]}`}>{name}</p>   
          <p className={`${style["priceWithDiscount"]}`}>
          <p className={`${style["title"]} ${style["price"]}`}>{ min_Cost ? min_Cost : '0'} LE</p>
          <p className={`${style["title"]} ${style["price"]} ${style["old-price"]}`}>&nbsp;LE{oldPrice}</p>
          </p>
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
                 src={el.image ? `${serve(el.image)}` : logo}
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
