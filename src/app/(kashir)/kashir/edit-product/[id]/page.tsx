'use client';
import { use, type FC } from 'react';
import EditProduct from '../__components/EditProduct';
import EditSizes from '../__components/EditSizes/EditSizes';
import EditColors from '../__components/EditColors/EditColors';
import EditSizeColors from '../__components/EditSizeColors/EditSizeColors';
import SwitchSizeColor from '../__components/EditDiscounts/SwitchSizeColor';
import { sendRequest } from '@/api';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

interface EditProductFormsProps {
    params: Promise<{ id: string }>;
}

const EditProductForms: FC<EditProductFormsProps> = ({params}) => {
    const id = use(params).id;
    const router = useRouter();
    
    return (
        <div className="min-h-screen bg-gray-50 p-6 space-y-2" dir="rtl">
            <button 
                className='w-[100px] bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors'
                onClick={() => {
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
                            sendRequest({ url: `/api/products/${id}`, method: 'DELETE' }).then(() => {
                                Swal.fire(
                                    'Deleted!',
                                    'Product has been deleted.',
                                    'success'
                                );
                                router.push('/kashir/product-list');
                            }).catch((error) => {
                                Swal.fire(
                                    'Error!',
                                    `Product has not been deleted. ${error}`,
                                    'error'
                                );
                            })
                        }
                      });
                }
                }
                >
                    Delete
                </button>
            <EditProduct id={id} />
            <EditSizes id={id} />
            <EditColors id={id} />
            <EditSizeColors id={id} />
            <SwitchSizeColor id={id} />
        </div>
    );
}

export default EditProductForms;

