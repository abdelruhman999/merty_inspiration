import React from 'react';
import Swal from 'sweetalert2';

interface DeleteOrderProps {
  orderId: number;
  onDelete: () => Promise<void>; 
}

const DeleteOrder: React.FC<DeleteOrderProps> = ({ orderId, onDelete }) => {
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'تأكيد الحذف',
      text: `هل أنت متأكد من حذف الطلب #${orderId}؟`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    });

    if (result.isConfirmed) {
      try {
        await onDelete(); 
        await Swal.fire({
          title: 'تم الحذف!',
          text: 'تم حذف الطلب بنجاح',
          icon: 'success',
          confirmButtonText: 'حسناً',
        });
      } catch (error) {
        await Swal.fire({
          title: 'خطأ!',
          text: 'فشل في حذف الطلب',
          icon: 'error',
        });
      }
    }
  };

  return (
    <div className='p-4'>
    <button 
      onClick={handleDelete}
      className="bg-red-500 cursor-pointer text-white px-2 py-2 rounded hover:bg-red-600"
    >
      حذف الطلب
    </button>

    </div>
  );
};

export default DeleteOrder;