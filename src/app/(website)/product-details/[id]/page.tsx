"use client";
import Image from "next/image";
import { useEffect, useMemo, useState, type FC } from "react";
import useRequest from "../../../../hooks/call";
import { useParams } from "next/navigation";
import { Product, ProductSizeColor } from "@/types/product";
import Loadercom from "@/component/Loadercom";
import style from "../../../../component/CardStyle/Cardstyle.module.css";
import styleimg from "./transtionImage.module.css";
import { useDispatch} from "react-redux";
import { addItemsShopping, setShow } from "@/redux/slices/dataShopping";
import Swal from "sweetalert2";
import {serve} from "@/api/utils";
import ImageWithLoader from "../../../../component/ImageWithLoader";

interface ProdcutdetailsProps {}

const Prodcutdetails: FC<ProdcutdetailsProps> = () => {
  const [price, setPrice] = useState<number>(0);
  const [old_Price , setOld_Price] = useState<number>(0)
  const [active, setactive] = useState<number>(0);
  const [sizeSelector, setSizeSelector] = useState<string>("");
  const [size, setSize] = useState<ProductSizeColor[]>([]);
  const [current_img, setCurrent_img] = useState<string>("");
  const [stock , setStock] = useState<number>(0)
  const [discount , setDiscount] = useState<number>(0)
  const [stock_id , setStock_id] = useState<number>(0)
  const dispatsh = useDispatch();
  const params = useParams();



  const { data } = useRequest<Product>({
    url: `/api/product-details/${params.id}`,
    method: "GET",
  });
  const Img_card = useMemo(() => {
    return (
      <>
        {data &&
          data?.colors.map((el) => {
            return (
              <Image
                onClick={() => {
                  setactive(0);
                  const element_img = data?.product_size_colors.filter((ele) => ele.color.image === el.image);
                  if ( element_img.length > 0) {    
                    console.log(element_img);
                                  
                    setSize(element_img);
                    const size_selector = element_img[0].size.size;
                    const price_size_selector = element_img[0].size.price;
                    const Stock_Size_selector = element_img[0].stock;
                    const Stock_id_selector = element_img[0].id;
                    if( element_img[0].discounts.length > 0){
                       const Discount_selector = (((element_img[0].discounts[0].discount) / price_size_selector)*100).toFixed(0);
                       setPrice(price_size_selector - element_img[0].discounts[0].discount) 
                       setOld_Price(price_size_selector)
                       setDiscount(Number(Discount_selector));     
                    }
                      else{
                       setDiscount(0);
                       setPrice(price_size_selector)
                      }
                    setStock_id(Stock_id_selector)
                    setStock(Stock_Size_selector)
                    setSizeSelector(size_selector);
                  }else
                  {
                    setSize([]);
                    setSizeSelector("");
                    setPrice(0);
                    setOld_Price(0);
                    setDiscount(0);
                  }
                  setCurrent_img(el.image);
                }}
                key={el.id}
                src={`${serve(el.image)}`}
                className={`h-[100px] w-[70px] hover:scale-80 duration-200 xs:size-[75px] cursor-pointer `}
                alt="logo"
                width={400}
                height={400}
              />
            );
          })}
      </>
    );
  }, [data]);

  // وهنا برجع اول صورة بالمعلومات بتاعتها سواء مقاس او سعر عشان اعرضها في الصفحة
  useEffect(() => {
    if (data) {          
     console.log(data);
     const first_img =  data.product_size_colors.filter((el) => el.color.image === data.colors[0].image);
      console.log(first_img);
      setCurrent_img(data.colors[0].image);
      if(first_img[0].discounts.length > 0){
        setPrice(first_img[0].size.price - first_img[0].discounts[0].discount)
        setOld_Price(first_img[0].size.price)
      }else{
        setPrice(first_img[0].size.price);
      }
      setSize(first_img);
    }
  }, [data]);

  // كده ديه بترجع اول مقاس بسعره لما اتنقل بين الصور 
  useEffect(() => {
    const ele = size.find((_, index) => index === 0);
    if (ele) {
      // console.log(ele);
      if(ele.stock > 0){ 
          if (ele.discounts.length>0) {
            setPrice(ele.size.price-ele.discounts[0].discount)  
            setOld_Price(ele.size.price)
          }else{
            setPrice(ele.size.price)
          }
      }
      setSizeSelector(ele.size.size);
    }
    else {
      setSizeSelector("");
      setPrice(0);
      setOld_Price(0);
      setDiscount(0);
    }
  }, [size]);

  // وهنا بجيب كل ستوك لما اعمل سيليكت عللى مقاس معين 
  useEffect(()=>{
    const stock =  size.filter((el)=>el.size.size === sizeSelector)  
    if(stock.length > 0){ 
        // console.log(stock[0]);
          if (stock[0].discounts.length>0) {
            const Discount_selector = (((stock[0].discounts[0].discount)/stock[0].size.price)*100).toFixed(0);
            setDiscount(Number(Discount_selector))   
            setPrice(stock[0].size.price-stock[0].discounts[0].discount)  
            setOld_Price(stock[0].size.price)
          }else{
            setPrice(stock[0].size.price)
            setDiscount(0)
          }
      setStock_id(stock[0].id);
      setStock(stock[0].stock);
    }
  },[sizeSelector])

   
  

  return (
    <>
      {data ? (
        <div
          className="flex
        justify-center items-center
        max-sm:items-center 
        max-sm:flex-col rounded-2xl
         gap-[50px] h-[650px] max-sm:h-auto
         max-sm:gap-[20px]
         bg-white w-[90%]"
        >
         <div className="flex gap-[15px] max-sm:flex-col max-sm:items-center flex-row-reverse">
  <div className="relative">
      {current_img ? (
        <ImageWithLoader
          src={current_img}
          className="object-contain"
          alt="logo"
          width={3016}
          height={4528}
          quality={100}
          loading="lazy"
          style={{
            maxHeight: '567px',
            width: 'auto',
            height: 'auto',
          }}
        />
      ) : (
        <p>الصورة غير موجودة حاليا</p>
      )}
    <div className="bg-black absolute w-[55px] h-[65px] rounded-br-full top-0 left-0 flex items-center justify-center">
      <p className="text-white pb-2 rotate-[-38deg]">{data.season.name}</p>
    </div>
  </div>
  <div className="flex justify-end items-start h-fit max-sm:w-full max-sm:justify-center w-[150px] flex-wrap gap-[10px]">
    {Img_card}
  </div>
</div>

          <div
            className="flex
           gap-[50px] flex-col pl-5"
          >
        <div
          className="flex
         flex-col 
         gap-[10px]
         max-sm:gap-[0]
         max-sm:items-center
         "
            >
              <div className="flex w-[300px]  justify-between items-start">
                <p
                  className="font-semibold
                  text-wrap 
                    max-sm:w-[200px]
                  text-2xl"
                >
                  {data.name} 
                </p>
                {
                stock > 0 &&  discount > 0 &&
                <p className={style["tag"]}>-{discount}%</p>
                }
              </div>
            </div>

            <div
              className="flex
              max-sm:items-start
                flex-col  
                max-sm:gap-[15px]  
                gap-[10px]
                "
            >
              <div className="flex ">
              <p className="text-3xl font-bold">LE {price}</p>
              {
               stock > 0 &&  discount > 0 &&
              <p className={`${style["title"]} ${style["price"]} ${style["old-price"]}`}>&nbsp;LE{old_Price}</p>
              }
              </div>
              <p
                className="text-wrap max-sm:text-
              w-[250px] max-sm:w-[200px] 
              text-sm font-semibold text-gray-400"
              >
                {data.description}
              </p>
            </div>

            <div
              className="flex flex-col
              max-sm:gap-[15px] 
              gap-[10px]"
            >
              <p className="text-xl xs:text-2xl">اختر المقاس</p>

              <div className="flex flex-wrap max-sm:w-[90%] max-sm:pr-0 w-[400px] -400 gap-2 pr-5">
            {
            size.map((el, index) => {
              const isOutOfStock = el.stock === 0;
              return (
                <div key={index} className="relative hover:scale-105 duration-200">
                  <button
                    disabled={isOutOfStock}
                    onClick={() => {
                      if (!isOutOfStock) {
                        if (el.discounts.length>0) {
                        const Discount_selector = (((el.discounts[0].discount)/el.size.price)*100).toFixed(0);
                        setDiscount(Number(Discount_selector))
                        setPrice(el.size.price - el.discounts[0].discount) 
                        setOld_Price(el.size.price)
                        }else{
                          setDiscount(0)
                          setPrice(el.size.price);
                        }
                        setactive(index);
                        setSizeSelector(el.size.size);
                        setStock(el.stock)
                        setStock_id(el.id)
                      }
                    }}
                    className={`text-xl 
                      border-black border
                      ${isOutOfStock ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 cursor-pointer'}
                      text-center w-[100px]
                      font-serif relative max-sm:w-[95px]
                      ${active === index ? "border-red-600" : ""}
                      p-[10px]`}
                  >
                    {el.size.size}
                  </button>
                  {isOutOfStock && (
                    <div className="absolute  inset-0 bg-black/50"></div>
                  )}
                </div>
              );
            })}
          </div>
            </div>

            <div className="flex  flex-col gap-[30px]">
         
            {
              stock > 0 &&
            <button
              onClick={() => {
                dispatsh(
                  addItemsShopping([
                    {
                      id:stock_id,
                      image: `${serve(current_img)}`,
                      name: data.name,
                      price: price,
                      old_Price:old_Price,
                      sizeSelector: sizeSelector,
                      count:1,
                      stock:stock
                    },
                  ])
                );
                Swal.fire({
                  title: "تمت الإضافة!",
                  text: "تمت إضافة المنتج إلى عربة التسوق",
                  icon: "success",
                  showCancelButton: true,
                  confirmButtonText: "شاهد عربة تسوقك",
                  cancelButtonText: "متابعة التسوق",
                }).then((result) => {
                  if (result.isConfirmed) {
                    dispatsh(setShow())
                  }
                });
              }}
              className="bg-black text-white text-center w-fit cursor-pointer p-[12px]"
            >
              اضف الى عربة تسوقك
            </button>
            }
              <div
                className="bg-gray-300 h-[1px]"></div>


            </div>
          </div>
        </div>
      ) : (
        <Loadercom />
      )}
    </>
  );
};

export default Prodcutdetails;
