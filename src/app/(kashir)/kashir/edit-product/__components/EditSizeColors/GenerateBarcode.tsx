import type { FC } from 'react';
import { useRef } from 'react';
import { useReactToPrint } from "react-to-print";
import Barcode from 'react-barcode';
import { FiPrinter } from 'react-icons/fi';
import { Size, Color } from '@/types/product';


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

interface GenerateBarcodeProps {
  sizeColor: SizeColor;
}

const GenerateBarcode: FC<GenerateBarcodeProps> = ({sizeColor}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef});
  return (<>

          <button
            type="button"
            onClick={() => reactToPrintFn()}
            className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors duration-200"
          >
            <FiPrinter className="h-5 w-5" />
          </button>

          <div className="flex flex-col items-center justify-between overflow-auto" ref={contentRef}>
            <p>{sizeColor.size.size  ? sizeColor.size.size + " - " : "" } {sizeColor.size.price.toString()}LE</p>
            <Barcode
              value={sizeColor.code} 
              className="h-[100px] w-[100px]" 
              format="CODE128"
              displayValue={true}
            />
          </div>  </>);
}

export default GenerateBarcode;
