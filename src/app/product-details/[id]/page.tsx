"use client";
import Image from "next/image";
import { memo, useEffect, useMemo, useState, type FC } from "react";
import useRequest from "../../../hooks/call";
import { useParams } from "next/navigation";
import { Base_Url } from "@/calls/constant";
import { HomeProduct, Product, ProductSizeColor } from "@/types/product";
import style from "../../../component/CardStyle/Cardstyle.module.css";
import Loadercom from "@/component/Loadercom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { addItemsShopping, setShow } from "@/redux/slices/dataShopping";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

interface ProdcutdetailsProps {}

const Prodcutdetails: FC<ProdcutdetailsProps> = () => {
  const [price, setPrice] = useState(0);
  const [active, setactive] = useState(0);
  const [sizeSelector, setSizeSelector] = useState("");
  const [size, setSize] = useState<ProductSizeColor[]>([]);
  const [current_img, setCurrent_img] = useState("");
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
                  const element_img = data?.product_size_colors.filter(
                    (ele) => ele.color.image === el.image
                  );
                  if (element_img) {
                    setSize(element_img);
                    const size_selector = element_img[0].size.size;
                    setSizeSelector(size_selector);
                  }
                  setCurrent_img(el.image);
                }}
                key={el.id}
                src={`${Base_Url}/${el.image}`}
                className={`h-[100px] w-[70px] hover:scale-80 duration-200 xs:size-[75px] cursor-pointer `}
                alt="logo"
                width={200}
                height={200}
              />
            );
          })}
      </>
    );
  }, [data]);

  useEffect(() => {
    if (data) {
      setCurrent_img(data.image);
      // console.log(data);
    }
  }, [data]);

  useEffect(() => {
    const ele = size.find((_, index) => index === 0);
    if (ele) {
      setPrice(ele.size.price);
    }
  }, [size]);

  return (
    <>
      {data ? (
        <div
          className="flex
        justify-center items-center
        xs:items-center 
        xs:flex-col rounded-2xl
         gap-[50px]  h-[650px]
         xs:gap-[20px]
         bg-white w-[90%]"
        >
          <div
            className="flex
          gap-[15px]  flex-row-reverse"
          >
            <div className="relative ">
              <Image
                src={`${Base_Url}/${current_img}`}
                className="w-[491px]
                xs:w-[350px] 
                xs:h-[400px]
                h-[567px]"
                alt="logo"
                width={400}
                height={400}
              />
              <div
                className="bg-black absolute 
                w-[55px] h-[65px] 
                rounded-br-full
                  top-0 left-0  flex
                items-center justify-center "
              >
                <p className="text-white pb-2  rotate-[-38deg]">
                  {data.season.name}
                </p>
              </div>
            </div>
            <div className="flex justify-end items-start h-fit w-[150px] flex-wrap gap-[10px]">
              <Image
                onClick={() => {
                  setCurrent_img(data.image);
                }}
                src={`${Base_Url}/${data.image}`}
                className={`h-[100px] w-[70px]
                   hover:scale-80 duration-200
                   xs:size-[75px] cursor-pointer `}
                alt="logo"
                width={200}
                height={200}
              />
              {Img_card}
            </div>
          </div>

          <div
            className="flex
        gap-[50px] flex-col"
          >
            <div
              className="flex
         flex-col 
         gap-[10px]
         xs:gap-[0]
         xs:items-center
         
         "
            >
              <div className="flex w-[300px] justify-between items-center">
                <p
                  className="font-semibold
          text-wrap  xs:w-[350px]
           text-2xl"
                >
                  {data.name}
                </p>
                <p className={style["tag"]}>-50%</p>
              </div>
            </div>

            <div
              className="flex
       xs:items-center
        flex-col
        xs:gap-[15px]
        gap-[10px]"
            >
              <p className="text-3xl font-bold">LE {price}</p>
              <p
                className="text-wrap xs:text-center
         w-[380px] xs:w-[350px]
        text-sm font-semibold text-gray-400"
              >
                {data.description}
              </p>
            </div>

            <div
              className="flex flex-col
        xs:gap-[15px]
        gap-[10px]"
            >
              <p className="text-xl xs:text-2xl">Select Size</p>

              <div className="flex gap-2">
                {size.map((el, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        setPrice(el.size.price);
                        setactive(index);
                        setSizeSelector(el.size.size);
                      }}
                      className={`text-xl 
                    border-black border
                    bg-gray-200 text-center
                    font-serif
                      w-[60px] cursor-pointer
                      ${active === index ? "border-red-600" : ""}
                      p-[10px]`}
                    >
                      {el.size.size}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-[30px]">
         

            <button
              onClick={() => {
                dispatsh(
                  addItemsShopping([
                    {
                      id:data.id,
                      image: `${Base_Url}/${current_img}`,
                      name: data.name,
                      price: price,
                      sizeSelector: sizeSelector,
                      count:1
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
              <div
                className="bg-gray-300
              h-[1px]"
              ></div>

              <p
                className="text-wrap 
                font-serif
                text-sm
                w-[330px]
                text-gray-500 
                 "
              >
                100% Original product.Cash on delivery is available on this
                product.Easy return and exchange policy within 7 days.
              </p>
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
