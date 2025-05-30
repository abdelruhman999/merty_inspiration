import Carousel from '@/component/Carousel';
import Pagination from '@/component/Pagination';
import type { FC } from 'react';
import type { Metadata } from 'next';
import ProductsList from '@/component/ProductsList ';
import { PromoAlert } from '@/component/PromoAlert ';

export const metadata: Metadata = {
  title: "ملابس قطن 100% - تسوق أفضل الملابس القطنية",
  description: "اكتشف تشكيلتنا المميزة من الملابس القطنية 100% للرجال والنساء. جودة عالية، خامات طبيعية، وتصاميم عصرية تناسب كل الأذواق.",
  keywords: ["ملابس قطن", "ملابس رجالي", "ملابس حريمي", "تيشيرتات قطن", "ملابس مريحة", "قطن طبيعي"],
  openGraph: {
    title: "ملابس قطن 100% - تسوق أفضل الملابس القطنية",
    description: "اكتشف تشكيلتنا المميزة من الملابس القطنية 100% للرجال والنساء.",
    url: "https://merty-inspiration.com/home", // غيّر الرابط للرابط الحقيقي
    siteName: "merty-inspiration",
    images: [
      {
         url: "/logo.ico", // غيّرها بصورة مناسبة
        width: 1200,
        height: 630,
        alt: "ملابس قطنية مميزة",
      },
    ],
    locale: "ar_EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ملابس قطن 100% - تسوق أفضل الملابس القطنية",
    description: "جودة عالية وخامات طبيعية للرجال والنساء.",
    images: ["/logo.ico"], // نفس الصورة اللي فوق
  },
  alternates: {
    canonical: "https://merty-inspiration.com/home", // غيّر الرابط للرابط الحقيقي
  },
};

const page: FC = async () => {
  return (
    <div className='w-full flex flex-col  items-center gap-[20px]'>
      <Carousel />
      <div className="flex justify-center max-sm:p-[0px] max-sm:gap-[10px] gap-[50px] flex-wrap w-full p-[50px]">
        <ProductsList />
        <PromoAlert />
      </div>
      <Pagination />
    </div>
  );
};

export default page;
