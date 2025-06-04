'use client';
import React, { useRef, useState } from 'react';
import { Table, TableHeader } from '@/component/Table/Table';
import { MdDelete } from 'react-icons/md';
import { sendRequest } from '@/api';
import useRequest from '@/hooks/call';
import { Size, Color } from '@/types/product';
import Swal from 'sweetalert2';
import { useForm, SubmitHandler } from 'react-hook-form';
import Image from 'next/image';
import { serve } from '@/api/utils';
import UpdateModal from './UpdateModal/UpdateModal';
import { FiEdit2, FiPrinter } from 'react-icons/fi';
import { LuRefreshCcw } from 'react-icons/lu';
import GenerateBarcode from './GenerateBarcode';



interface SizeColor {
  id: string;
  stock: number;
  price: number;
  size_id: string;
  color_id: string;
  size: Size;
  color: Color;
  code: string;
}

interface SizeColorCreate {
  stock: number;
  // price: number;
  product_id: number;
  size_id: string;
  color_id: string;
}

interface EditSizeColorsProps {
  id: string;
}

export default function EditSizeColors({ id }: EditSizeColorsProps) {
  const [refresh, setRefresh] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedSizeColor, setSelectedSizeColor] = useState<SizeColor | null>(null);
  const { data: sizeColors } = useRequest<SizeColor[]>({
    url: `/api/product/${id}/size-colors`,
    method: 'GET',
  }, [id, refresh]);

  const { data: sizes } = useRequest<Size[]>({
    url: `/api/product/${id}/sizes`,
    method: 'GET',
  }, [id , refresh]);

  const { data: colors } = useRequest<Color[]>({
    url: `/api/product/${id}/colors`,
    method: 'GET',
  }, [id , refresh]);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<SizeColorCreate>({
    defaultValues: {
      stock: 0,
      // price: 0,
      size_id: '',
      color_id: '',
      product_id: Number(id)
    }
  });

  const onSubmit: SubmitHandler<SizeColorCreate> = async (data) => {
    sendRequest({
      url: `/api/product/${id}/size-colors`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify(data),
    })
    .then(() => {
      setRefresh(prev => !prev);
      reset();
      Swal.fire({
        icon: 'success',
        text: 'Size-Color combination added successfully',
        showConfirmButton: false,
        timer: 1000
      });
    })
    .catch((error) => {
      Swal.fire({
        icon: 'error',
        text: `Error adding size-color: ${error}`,
        showConfirmButton: false,
        timer: 1000
      });
    });
  };

  const handleDelete = async (sizeColorId: string) => {
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
          url: `/api/product/${id}/size-colors`,
          method: 'DELETE',
          data: JSON.stringify({ id: sizeColorId }),
        })
        .then(() => {
          setRefresh(prev => !prev);
          Swal.fire({
            icon: 'success',
            text: 'Size-Color combination deleted successfully',
            showConfirmButton: false,
            timer: 1000
          });
        })
        .catch((error) => {
          Swal.fire({
            icon: 'error',
            text: `Error deleting size-color: ${error}`,
            showConfirmButton: false,
            timer: 1000
          });
        });
      }
    });
  };

  const tableHeaders: TableHeader<SizeColor>[] = [
    {
      key: 'size',
      label: 'المقاس',
      render: (sizeColor: SizeColor) => sizeColor.size.size
    },

    {
      key: 'color',
      label: "الاسم",
      render: (sizeColor: SizeColor) => (
        <div className="flex items-center gap-3 justify-center">
          <span className="font-mono text-sm">{sizeColor.color.name || sizeColor.color.color}</span>
        </div>
      )
    },
    {
      key: 'color',
      label: 'كود اللون',
      render: (sizeColor: SizeColor) => (
        <div className="flex items-center gap-3 justify-center">
          <div 
            className="w-8 h-8 rounded-full border shadow-sm"
            style={{ backgroundColor: sizeColor.color.color }}
          />
          <span className="font-mono text-sm">{sizeColor.color.color}</span>
        </div>
      )
    },
    {
      key: 'color',
      label: 'الصورة',
      render: (sizeColor: SizeColor) => (
        <div className="flex items-center gap-3 justify-center">
          <Image
            src={serve(sizeColor.color.image)}
            alt={sizeColor.color.color || 'Color Image'}
            width={100}
            height={100}
            className="object-cover rounded-lg"
          />
        </div>
      )
    },
    {
      key: 'stock',
      label: "العدد فى المخزن",
      render: (sizeColor: SizeColor) => sizeColor.stock
    },
    {
      key: 'price',
      label: 'السعر',
      render: (sizeColor: SizeColor) => sizeColor.size.price
    },
    {
      key: 'code',
      label: 'Barcode',
      render: (sizeColor: SizeColor) =>
      <GenerateBarcode
        sizeColor={sizeColor}
      />
    },
    {
      key: 'id',
      label: 'العمليات',
      render: (sizeColor: SizeColor) => (
        <div className="flex gap-2 justify-center">
          <button
            type="button"
            onClick={() => {
              setSelectedSizeColor(sizeColor);
              setUpdateModalOpen(true);
            }}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors duration-200"
          >
            <FiEdit2 className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => handleDelete(sizeColor.id)}
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
      <style>
      {`
      @media print {
        body {
          margin: 0;
          padding: 0;
        }
        #barcode {
          width: 38mm;
          height: 25mm;
          margin: 0;
          page-break-after: always;
        }
        @page {
          size: 38mm 25mm;
          margin: 0;
        }
      }
      `}
      </style>

      <div className="flex items-center gap-2 justify-between">
        <button type="button" onClick={() => setRefresh(prev => !prev)} className="flex items-center gap-2 rounded-md p-2 bg-blue-400 shadow-2xl hover:bg-blue-500 cursor-pointer"> 
          <LuRefreshCcw  className="h-5 w-5" />
        </button>
        <h3 className="text-xl font-semibold text-gray-800"> المقاسات والألوان </h3>
        <div className="h-0.5 flex-grow mx-4 bg-gray-100"></div>
      </div>
      {
        selectedSizeColor ? (
          <UpdateModal
            isOpen={updateModalOpen}
            onClose={() => {setUpdateModalOpen(false);setSelectedSizeColor(null)}}
            onSuccess={() => setRefresh(prev => !prev)}
            sizeColor={selectedSizeColor}
          />
        ) : null
      }
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-wrap gap-6 items-center">

          <label htmlFor="sizeId">اللون</label>
          <select
            {...register('color_id', { required: 'هذا الحقل مطلوب' })}
            className={`w-32 px-3 py-2 rounded-md border ${
              errors.color_id ? 'border-red-500' : 'border-gray-300'
            } focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors`}
          >
            <option value="">Select Color</option>
            {colors?.map((color) => {
              const image = serve(color.image);
              const colorName = color.name || color.color;
              console.log(image , colorName);
              return (
                <option key={color.id} value={color.id}  className="font-mono text-sm" >
                  {colorName}
                </option>
              )
            })}
          </select>
          {errors.color_id && <span className="text-red-500">{errors.color_id.message}</span>}


          <label htmlFor="sizeId">المقاس</label>
          <select
            {...register('size_id', { required: 'هذا الحقل مطلوب' })}
            className={`w-32 px-3 py-2 rounded-md border ${
              errors.size_id ? 'border-red-500' : 'border-gray-300'
            } focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors`}
          >
            <option value="">Select Size</option>
            {sizes?.map((size) => (
              <option key={size.id} value={size.id}>
                {size.size}
              </option>
            ))}
          </select>
          {errors.size_id && <span className="text-red-500">{errors.size_id.message}</span>}

          <label htmlFor="stock">العدد</label>
          <input
            id="stock"
            type="number"
            placeholder="Stock"
            {...register('stock', { required: 'هذا الحقل مطلوب', min: 0 })}
            className={`w-32 px-3 py-2 rounded-md border ${
              errors.stock ? 'border-red-500' : 'border-gray-300'
            } focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors`}
          />
          {errors.stock && <span className="text-red-500">{errors.stock.message}</span>}
          <button 
            type="submit"
            disabled={!!errors.size_id || !!errors.color_id || !!errors.stock }
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Size-Color
          </button>
        </div>
      </form>

      <Table
        headers={tableHeaders}
        data={sizeColors || []}
        className="bg-white rounded-lg shadow-sm"
      />
    </div>
  );
}
