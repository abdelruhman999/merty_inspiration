'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Table, TableHeader } from '@/component/Table/Table';
import { FiEdit2 } from 'react-icons/fi';
import { MdDelete, MdFileUpload } from 'react-icons/md';
import Image from 'next/image';
import { sendRequest } from '@/api';
import useRequest from '@/hooks/call';
import { Color , ColorCreate } from '@/types/product';
import Swal from 'sweetalert2';
import {useForm ,SubmitHandler  } from 'react-hook-form';
// import UpdateModal from './UpdateModal/UpdateModal';
import { serve } from '@/api/utils';
import { LuRefreshCcw } from 'react-icons/lu';


interface EditColorsProps {
  id: string;
}

export default function EditColors({ id }: EditColorsProps) {
  const [refresh, setRefresh] = useState(false);
  // const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  // const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { data } = useRequest<Color[]>({
    url: `/api/product/${id}/colors`,
    method: 'GET',
  },[id , refresh]);

  const { register, handleSubmit, formState: { errors}, reset , setValue} = useForm<ColorCreate>({
    defaultValues: {
      id: 0,
      color: '',
      image: null,
      name: '',
      product: Number(id)
    }
  });



  const onSubmit: SubmitHandler<ColorCreate> = async (data ) => {
    console.log(data)
    const form = new FormData();
    form.append('color', data.color);
    form.append('name', data.name);
    
    if (data.image && data.image instanceof FileList) {
      console.log(data.image);
      form.append('image', data.image[0]);
    }
    else if (data.image && data.image instanceof File) {
      form.append('image', data.image);
    }
    form.append('product', id);
    console.log(form);
    sendRequest({
        url: `/api/product/${id}/colors`,
        method: 'POST',
        data: form,
        ignoreContentType: true
      })
      .then(() => {
        setRefresh(prev => !prev);
        reset();
        setImageUrl(null);
      })
      .catch((error) => {
        alert(`Error adding color: ${error}`);
      });
  };



  const handleDeleteColor = async (colorId: string) => {
    sendRequest({
      url: `/api/product/${id}/colors`,
      method: 'DELETE',
      data: JSON.stringify({ id: colorId }),
    })
    .then(() => {
      setRefresh(prev => !prev)
      Swal.fire({
        icon: 'success',
        text: 'Color deleted successfully',
        showConfirmButton: false,
        timer: 1000
      })
    })
    .catch((error) => {
      Swal.fire({
        icon: 'error',
        text: `Error deleting color: ${error}`,
        showConfirmButton: false,
        timer: 1000
      })
    });
  };
  const imageField = register('image', { required: 'هذا الحقل مطلوب' });

  const tableHeaders: TableHeader<Color>[] = [

    {
      key: 'name',
      label: 'اسم اللون',
      render: (color: Color) => (
        <div className="flex items-center gap-3 justify-center">
          {
            <>
              <span className="font-mono text-sm">{color.name || color.color}</span>
            </>
          }
        </div>
      )
    },
    {
      key: 'color',
      label: 'كود اللون',
      render: (color: Color) => (
        <div className="flex items-center gap-3 justify-center">
          {
            <>
              <div 
                className="w-8 h-8 rounded-full border shadow-sm"
                style={{ backgroundColor: color.color }}
              />
              <span className="font-mono text-sm">{color.color}</span>
            </>
          }
        </div>
      )
    },
    {
      key: 'image',
      label: 'الصورة',
      render: (color: Color) => (
        <div className="flex items-center justify-center">
          {
            <div className="relative w-28 h-28 rounded-lg overflow-hidden">
              <Image
                src={serve(color.image)}
                alt={color.color || 'Color Image'}
                fill
                className="object-cover"
              />
            </div>
          }
        </div>
      )
    },
    {
      key: 'id',
      label: 'العمليات',
      render: (color: Color) => (
          <div className="flex gap-2 justify-center">
            <button
              type="button"
              onClick={() => handleDeleteColor(color.id.toString())}
              className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors duration-200"
            >
              <MdDelete className="h-5 w-5" />
            </button>
          </div>
        )
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="flex items-center gap-2 justify-between">
        <button type="button" onClick={() => setRefresh(prev => !prev)} className="flex items-center gap-2 rounded-md p-2 bg-blue-400 shadow-2xl hover:bg-blue-500 cursor-pointer"> 
          <LuRefreshCcw  className="h-5 w-5" />
        </button>
        <h3 className="text-xl font-semibold text-gray-800">الوان المنتج</h3>
        <div className="h-0.5 flex-grow mx-4 bg-gray-100"></div>
      </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-3">
              <label htmlFor="name" className="text-gray-700">اسم اللون</label>
              <input 
              type="text" 
              {...register('name', { required: 'هذا الحقل مطلوب'})} 
              className={` h-8 p-1 rounded border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors`} />
              {errors.name && <span className="text-red-500">{errors.name.message}</span>}

              <label htmlFor="color" className="text-gray-700">اللون</label>
              <input
                type="color"
                {...register('color', { required: 'هذا الحقل مطلوب'})}
                className={`w-20 h-8 p-1 rounded border ${
                  errors.color ? 'border-red-500' : 'border-gray-300'
                } focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors`}
              />
              {errors.color && <span className="text-red-500">{errors.color.message}</span>}
            </div>
            <label className="cursor-pointer" >
              <input
                type="file"
                accept="image/*"
                {...imageField}
                onChange={(e)=>{
                  imageField.onChange(e)
                  setImageUrl(e.currentTarget.files?.[0] ? URL.createObjectURL(e.currentTarget.files[0]) : null)
                }}
                className="hidden"
              />
              {errors.image && <span className="text-red-500">{errors.image.message}</span>}

              <div className="flex items-center gap-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                <MdFileUpload className="h-5 w-5" />
                <span className="text-sm">ارفاق صورة</span>
              </div>

              </label>

              {imageUrl && (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt="Color Image"
                    fill
                    className="object-cover"
                  />
                </div>
              )}


            <button 
              type="submit"
              disabled={!!errors.color || !!errors.image}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              Add Color
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
