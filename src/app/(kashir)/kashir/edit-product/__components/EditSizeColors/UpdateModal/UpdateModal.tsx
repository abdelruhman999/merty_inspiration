import { sendRequest } from "@/api";
import Modal from "@/component/Modal/Modal";
import { Size, Color } from "@/types/product";
import { useForm, SubmitHandler } from 'react-hook-form';
import Image from 'next/image';
import { serve } from '@/api/utils';

interface SizeColor {
  id: string;
  stock: number;
  price: number;
  size_id: string;
  color_id: string;
  size: Size;
  color: Color;
}

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  sizeColor: SizeColor;
}

const UpdateModal: React.FC<UpdateModalProps> = ({ isOpen, sizeColor, onClose, onSuccess }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<SizeColor>({
    defaultValues: sizeColor
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Update Size-Color Combination</h2>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span>Size:</span>
            <span className="font-semibold">{sizeColor.size.size}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Color:</span>
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded-full border shadow-sm"
                style={{ backgroundColor: sizeColor.color.color }}
              />
              <Image
                src={serve(sizeColor.color.image)}
                alt={sizeColor.color.color}
                width={40}
                height={40}
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
        
        <form className="space-y-4" onSubmit={handleSubmit((data) => {
          sendRequest({
            url: `/api/product/${sizeColor.size.product}/size-colors`,
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify({
              id: data.id,
              stock: data.stock,
              size_id: data.size_id,
              color_id: data.color_id
            }),
          })
          .then(() => {
            onClose();
            reset();
            onSuccess();
          })
          .catch((error) => {
            alert(`Error updating size-color: ${error}`);
          });
        })}>
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
            <input
              id="stock"
              type="number"
              {...register('stock', { required: 'هذا الحقل مطلوب', min: 0 })}
              className={`w-full px-3 py-2 rounded-md border ${
                errors.stock ? 'border-red-500' : 'border-gray-300'
              } focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-200`}
            />
            {errors.stock && (
              <p className="text-red-500 text-sm mt-1 animate-fadeIn">{errors.stock.message}</p>
            )}
          </div>

          <button 
            type="submit" 
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            Update
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default UpdateModal;