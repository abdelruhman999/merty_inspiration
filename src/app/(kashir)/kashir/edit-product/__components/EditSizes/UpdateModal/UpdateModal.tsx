import { sendRequest } from "@/api";
import Modal from "@/component/Modal/Modal";
import { Size } from "@/types/product";
import {useForm } from 'react-hook-form';




interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  size: Size;
}

const UpdateModal: React.FC<UpdateModalProps> = ({ isOpen , size , onClose , onSuccess }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<Size>({
      defaultValues: size
    });
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Update Size</h2>
        <form className="space-y-3" onSubmit={handleSubmit((data) => {
          sendRequest({
            url: `/api/product/${size.product}/sizes`,
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify(data),
          })
          .then(() => {
            onClose();
            reset();
            onSuccess();
          })
          .catch((error) => {
            alert(`Error updating size: ${error}`);
          });
        })}>
          <input
            type="text"
            {...register('size', { required: 'هذا الحقل مطلوب' })}
            className={`w-32 px-3 py-2 rounded-md border ${errors.size ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-200`}
          />
          {errors.size && (
            <p className="text-red-500 text-sm mt-1 animate-fadeIn">{errors.size.message}</p>
          )}
          <input
            type="number"
            {...register('price',{min:0 , required: 'هذا الحقل مطلوب' })}
            className={`w-32 px-3 py-2 rounded-md border ${errors.price ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-200`}
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1 animate-fadeIn">{errors.price.message}</p>
          )}
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2">
            Update
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default UpdateModal;
