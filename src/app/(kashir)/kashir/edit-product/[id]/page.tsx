'use client';
import { use, type FC } from 'react';
import EditProduct from '../__components/EditProduct';
import EditSizes from '../__components/EditSizes/EditSizes';
import EditColors from '../__components/EditColors/EditColors';
import EditSizeColors from '../__components/EditSizeColors/EditSizeColors';
import SwitchSizeColor from '../__components/EditDiscounts/SwitchSizeColor';


interface EditProductFormsProps {
    params: Promise<{ id: string }>;
}

const EditProductForms: FC<EditProductFormsProps> = ({params}) => {
    const id = use(params).id;
    return (
        <div className="min-h-screen bg-gray-50 p-6 space-y-2" dir="rtl">
            <EditProduct id={id} />
            <EditSizes id={id} />
            <EditColors id={id} />
            <EditSizeColors id={id} />
            <SwitchSizeColor id={id} />
        </div>
    );
}

export default EditProductForms;

