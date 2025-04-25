'use client';
import React, { useState } from 'react';
import { Table, TableHeader } from '@/component/Table/Table';

import { ProductSizeColor , Discounts_types} from '@/types/product';
import useRequest from '@/hooks/call';
import { useForm } from 'react-hook-form';
import { LuRefreshCcw } from 'react-icons/lu';
import { sendRequest } from '@/api';
import Swal from 'sweetalert2';
import { MdDelete } from 'react-icons/md';



interface EditDiscountsProps {
  sizeColor: ProductSizeColor;
}

export default function EditDiscounts({ sizeColor }: EditDiscountsProps) {
  const [refresh , setRefresh ] = useState(false);
  const {data , loading ,   error } = useRequest<Discounts_types[]>({
    url: `/api/product/${sizeColor.id}/discounts`,
    method: 'GET',
  },[refresh , sizeColor.id]);

  const {register , handleSubmit , formState: {errors} , reset} = useForm<Discounts_types>({
    defaultValues: {
      discount: 0,
      start_date: '',
      end_date: '',
      size_color : sizeColor.id,
    },
  });

  const onSubmit = (data: Discounts_types) => {
    sendRequest({
      url: `/api/product/${sizeColor.id}/discounts`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify(data),
    })
    .then(() => {
      setRefresh(prev => !prev);
      reset();
      Swal.fire({
        icon: 'success',
        text: 'تم اضافة الخصم بنجاح',
        showConfirmButton: false,
        timer: 1000
      });
    })
    .catch((error) => {
      Swal.fire({
        icon: 'error',
        text: `حدث خطا عند اضافة الخصم ${error}`,
        showConfirmButton: false,
        timer: 1000
      });
    });
  };

  const handleDeleteDiscount = async (discountId: string) => {
        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
          if (result.isConfirmed) {
            sendRequest({
              url: `/api/product/${sizeColor.id}/discounts`,
              method: 'DELETE',
              data: JSON.stringify({ id: discountId }),
            })
            .then(() => {
              setRefresh(prev => !prev);
              Swal.fire({
                icon: 'success',
                text: 'تم حذف الخصم بنجاح',
                showConfirmButton: false,
                timer: 1000
              });
            })
            .catch((error) => {
              Swal.fire({
                icon: 'error',
                text: `حدث خطأ عند حذف الخصم: ${error}`,
                showConfirmButton: false,
                timer: 1000
              });
            });
          }
        });
      };
    
    


  const tableHeaders: TableHeader<Discounts_types>[] = [
    {
      key: 'discount',
      label: 'الخصم',
      render: (discount: Discounts_types) =>`${discount.discount} EGP`
    },
    {
      key: 'discount',
      label: '% الخصم',
      render: (discount: Discounts_types) =>{
        console.log(sizeColor.size.price , discount.discount);
        return `${Math.round((discount.discount / sizeColor.size.price) * 100)} %`
      }
    },
    {
      key: 'start_date',
      label: 'تاريخ البدء',
      render: (discount: Discounts_types) => discount.start_date
    },
    {
      key: 'end_date',
      label: 'تاريخ الانتهاء',
      render: (discount: Discounts_types) => discount.end_date
    },
    {
      key: 'id',
      label: 'العمليات',
      render: (discount: Discounts_types) => (
        <div className="flex gap-2 justify-center">
          <button
            type="button"
            onClick={() => handleDeleteDiscount(String(discount.id))}
            className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors duration-200"
          >
            <MdDelete className="h-5 w-5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 ">
      <button type="button" onClick={() => setRefresh(prev => !prev)} className="flex items-center gap-2 rounded-md p-2 bg-blue-400 shadow-2xl hover:bg-blue-500 cursor-pointer"> 
        <LuRefreshCcw  className="h-5 w-5" />
      </button>
      <h3 className="text-lg font-semibold">خصومات Size-Color ( {sizeColor.color.name || sizeColor.color.color} | {sizeColor.size.size} )</h3>
      <div className="h-0.5 flex-grow mx-4 bg-gray-100"></div>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap gap-3 items-center" >

        <div className="flex flex-wrap gap-3 items-center">
          <label htmlFor="discount" className="block font-medium text-gray-700">الخصم</label>
          <input
            type="number"
            {...register('discount', {
              required: 'الخصم مطلوب',
            })}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="الخصم"
          />
          {errors.discount && <p className="text-red-500">{errors.discount.message}</p>}
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <label htmlFor="start_date" className="block font-medium text-gray-700">تاريخ البدء</label>
          <input
            type="date"
            {...register('start_date', {
              required: 'تاريخ البدء مطلوب',
            })}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.start_date && <p className="text-red-500">{errors.start_date.message}</p>}
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <label htmlFor="end_date" className="block font-medium text-gray-700">تاريخ الانتهاء</label>
          <input
            type="date"
            {...register('end_date', {
              required: 'تاريخ الانتهاء مطلوب',
            })}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.end_date && <p className="text-red-500">{errors.end_date.message}</p>}
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
          Add Discount
        </button>
        </div>
      </form>

      <Table
        headers={tableHeaders}
        data={data || []}
        className="bg-white rounded-lg shadow-sm"
      />
    </div>
  );
}
