'use client'
import { Size } from '@/types/product';
import React, { forwardRef } from 'react';
import Barcode from 'react-barcode';

interface SizeColor {
  size: Size;
  price: number;
  code: string;
}

const GenerateBarcode = forwardRef<HTMLDivElement, SizeColor>(
  ({ size, price, code }, ref) => {
    return (
      <div
        className="flex flex-col items-center justify-between overflow-auto"
        ref={ref}
      >
        <p>{size ? size.size + " - " : ""} {price.toString()}LE</p>
        <Barcode
          value={code}
          className="h-[100px] w-[100px]"
          format="CODE128"
          displayValue={true}
        />
      </div>
    );
  }
);

export default GenerateBarcode;
