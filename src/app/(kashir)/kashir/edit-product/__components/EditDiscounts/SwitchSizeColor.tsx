'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Table, TableHeader } from '@/component/Table/Table';
import { FiEdit2 } from 'react-icons/fi';
import { MdDelete } from 'react-icons/md';
import { sendRequest } from '@/api';
import { Size, Color } from '@/types/product';
import { ProductSizeColor } from '@/types/product';
import useRequest from '@/hooks/call';
import { serve } from '@/api/utils';
import EditDiscounts from './EditDiscounts';
import Image from 'next/image';
import { LuRefreshCcw } from 'react-icons/lu';





interface Discount {
  id: string;
  percentage: number;
  startDate: string;
  endDate: string;
  active: boolean;
  sizeId?: string;
  colorId?: string;
  size?: Size;
  color?: Color;
  actions?: string;
}

interface EditDiscountsProps {
  id: string;
}

export default function SwitchSizeColor({ id }: EditDiscountsProps) {
  const [refresh , setRefresh ] = useState(false);
  const [selectedSizeColor, setSelectedSizeColor] = useState<ProductSizeColor | null>(null);
  const {data , loading , error } = useRequest<ProductSizeColor[]>({
    url: `/api/product/${id}/size-colors`,
    method: 'GET',
  },[refresh]);


  
  const tableHeaders: TableHeader<ProductSizeColor>[] = [
    {
      key: 'size',
      label: 'Size',
      render: (sizeColor: ProductSizeColor) => sizeColor.size.size
    },
    {
      key: 'color',
      label: 'Color',
      render: (sizeColor: ProductSizeColor) => (
        <div className="flex items-center gap-3 justify-center">
          <div 
            className="w-8 h-8 rounded-full border shadow-sm"
            style={{ backgroundColor: sizeColor.color.color }}
          />
          <span className="font-mono text-sm">{sizeColor.color.color}</span>
        </div>
      )
    },    {
      key: 'color',
      label: 'Image',
      render: (sizeColor: ProductSizeColor) => (
        <div className="flex items-center gap-3 justify-center">
        </div>
      )
    },
    {
      key: 'stock',
      label: 'Stock',
      render: (sizeColor: ProductSizeColor) => sizeColor.stock
    },
    {
      key: 'size',
      label: 'Price',
      render: (sizeColor: ProductSizeColor) => sizeColor.size.price
    },
  ];
  return (
    <div className="space-y-4">
      <div className="h-0.5 flex-grow my-4 bg-gray-100"></div>
      <div className="flex items-center gap-2">
      <button type="button" onClick={() => setRefresh(prev => !prev)} className="flex items-center gap-2 rounded-md p-2 bg-blue-400 shadow-2xl hover:bg-blue-500 cursor-pointer"> 
        <LuRefreshCcw  className="h-5 w-5" />
      </button>
      <h3 className="text-lg font-semibold">اختر من التالى لاظهار الخصومات</h3>
      </div>
      <div className="grid grid-cols-4 gap-3">
      {
        data ? (
          data.map((sizeColor) => (
            <div key={sizeColor.id} className={`flex items-center gap-3 text-xl  cursor-pointer bg-white shadow-lg rounded-md p-3 ${selectedSizeColor?.id === sizeColor.id ? 'border border-black' : ''}`} 
            onClick={() => setSelectedSizeColor(sizeColor)}
            >
              <div className="flex items-center gap-3 justify-center ">
                <div 
                  className="w-8 h-8 rounded-full border shadow-sm"
                  style={{ backgroundColor: sizeColor.color.color }}
                />
                <span className="font-mono ">{sizeColor.color.name || sizeColor.color.color}</span>
              </div>
              <span className="font-mono ">{sizeColor.size.size} |</span>
              <Image
                src={serve(sizeColor.color.image)}
                alt={sizeColor.color.color}
                width={40}
                height={40}
                className="rounded-lg object-cover"
              />
            </div>
          ))
        ) : null
      }
      </div>
      
      {selectedSizeColor && (
        <EditDiscounts sizeColor={selectedSizeColor!} />
      )}
    </div>
  );
}
