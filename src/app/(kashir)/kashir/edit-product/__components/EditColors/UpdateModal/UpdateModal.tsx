import { sendRequest } from "@/api";
import Modal from "@/component/Modal/Modal";
import { Color , ColorCreate} from "@/types/product";
import { useState } from "react";
import {useForm ,SubmitHandler} from 'react-hook-form';
import { MdFileUpload } from "react-icons/md";




interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  color: Color;
}

const UpdateModal: React.FC<UpdateModalProps> = ({ isOpen , color , onClose , onSuccess }) => {
    const { register, handleSubmit, formState: { errors }, reset , setValue} = useForm<Color>({
      defaultValues: color
    });
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const imageField = register('image', { required: 'هذا الحقل مطلوب' });

  const handleFileChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files){
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
              if (typeof reader.result === 'string') {
                setImageUrl(reader.result);
                setValue('image', file);
              }
            };  
            reader.readAsDataURL(file);
        }
        };
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Update Color</h2>
        <form className="space-y-3" onSubmit={handleSubmit((data) => {
          sendRequest({
            url: `/api/product/${color.product}/colors`,
            method: 'PUT',
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
            type="color"
            {...register('color', { required: 'هذا الحقل مطلوب' })}
            className={`w-32 px-3 py-2 rounded-md border ${errors.color ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-200`}
          />
          {errors.color && (
            <p className="text-red-500 text-sm mt-1 animate-fadeIn">{errors.color.message}</p>
          )}

            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                {...imageField}
                className="hidden"
                onChange={(e)=>{
                  imageField.onChange(e)
                  handleFileChange(e)
                }}
              />

              <div className="flex items-center gap-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                <MdFileUpload className="h-5 w-5" />
                <span className="text-sm">Upload Image</span>
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

          {errors.image && (
            <p className="text-red-500 text-sm mt-1 animate-fadeIn">{errors.image.message}</p>
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
