'use client';
import React, { useEffect, useState } from 'react';
import { Table, TableHeader } from '@/component/Table/Table';
import { FiEdit2 } from 'react-icons/fi';
import { MdDelete } from 'react-icons/md';
import { sendRequest } from '@/api';
import useRequest from '@/hooks/call';
import {useForm ,SubmitHandler} from 'react-hook-form';
import {Size} from '@/types/product';
import UpdateModal from './UpdateModal/UpdateModal';
import Swal from 'sweetalert2';
import { LuRefreshCcw } from 'react-icons/lu';



interface EditSizesProps {
  id: string;
}

export default function EditSizes({ id }: EditSizesProps) {
  const [refresh, setRefresh ] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const { register, handleSubmit,formState: { errors }, reset } = useForm<Size>({
    defaultValues:{
      id:0,
      size:'',
      price:0,
      product: Number(id)
    }
  });
  const { data, loading, error } = useRequest<Size[]>({
    url: `/api/product/${id}/sizes`,
    method: 'GET',
  },[id , refresh]);

  const onSubmit: SubmitHandler<Size> = async (data) => {
    sendRequest({
        url: `/api/product/${id}/sizes`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify(data),
      })
      .then(() => {
        setRefresh(prev => !prev);
        reset();
      })
      .catch((error) => {
        alert(`Error adding size: ${error}`);
      });
  };



  const handleDeleteSize = (sizeId: string) => {
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
          url: `/api/product/${id}/sizes`,
          method: 'DELETE',
          data: JSON.stringify({ id: sizeId }),
        })

        .then(() => setRefresh(prev => !prev))
        .catch((error) => {
          alert(`Error deleting size: ${error}`);
        });
      }
    })  ;
  };


  const tableHeaders: TableHeader<Size>[] = [
    {
      key: 'size',
      label: 'المقاس',
      render: (size: Size) => size.size
    },
    {
      key: 'price',
      label: 'السعر',
      render: (size: Size) => size.price
    },
    {
      key: 'id',
      label: 'العمليات',
      render: (size: Size) => (
          <div className="flex gap-2 justify-center">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
              onClick={() => {
                setSelectedSize(size);
                setUpdateModalOpen(true);
              }}
            >
              <FiEdit2 className="h-4 w-4" />
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
              onClick={() => handleDeleteSize(size.id.toString())}
            >
              <MdDelete className="h-4 w-4" />
            </button>
          </div>
        )
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      {
        selectedSize ? (
        <UpdateModal onSuccess={() => setRefresh(prev => !prev)} isOpen={updateModalOpen} onClose={() => {setUpdateModalOpen(false);setSelectedSize(null)}} size={selectedSize} />
        ) : null
      }
        <div className="flex items-center gap-2 justify-between">
          <button type="button" onClick={() => setRefresh(prev => !prev)} className="flex items-center gap-2 rounded-md p-2 bg-blue-400 shadow-2xl hover:bg-blue-500 cursor-pointer"> 
            <LuRefreshCcw  className="h-5 w-5" />
          </button>
          <h3 className="text-xl font-semibold text-gray-800">مقاسات المنتج</h3>
        <div className="h-0.5 flex-grow mx-4 bg-gray-100"></div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h3 className="text-lg font-semibold">المقاسات</h3>
      <div className="flex flex-wrap gap-3 items-center">
        <label htmlFor="size" className="block font-medium text-gray-700">المقاس</label>
        <input
          type="text"
          {...register('size', { required: 'هذا الحقل مطلوب' })}
          className={`w-32 px-3 py-2 rounded-md border ${errors.size ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-200`}
        />
        {errors.size && (
          <p className="text-red-500 text-sm mt-1 animate-fadeIn">{errors.size.message}</p>
        )}
        <label htmlFor="price" className="block font-medium text-gray-700">السعر</label>
        <input
          type="number"
          {...register('price',{min:0 , required: 'هذا الحقل مطلوب' })}
          className={`w-32 px-3 py-2 rounded-md border ${errors.price ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-200`}
        />
        {errors.price && (
          <p className="text-red-500 text-sm mt-1 animate-fadeIn">{errors.price.message}</p>
        )}
        <button 
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          Add Size
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
