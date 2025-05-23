'use client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { Select } from '@/component/Select/Select';
import { sendRequest } from '@/api';
import { Product } from '@/types/product';

interface Season {
    id: string;
    name: string;
}

interface ProductForm {
    name: string;
    description: string;
    season: string;
    is_active: boolean;
}

export default function AddProduct() {
    const router = useRouter();
    const [seasons, setSeasons] = useState<Season[]>([]);
    const [loading, setLoading] = useState(false);
    const [isActive, setIsActive] = useState(true);
    
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProductForm>();

    useEffect(() => {
        fetchSeasons();
    }, []);

    const fetchSeasons = async () => {
        try {
            const response = await sendRequest<Season[]>({
                method: 'GET',
                url: '/api/seasons',
            });
            setSeasons(response);
        } catch (error) {
            console.error('Error fetching seasons:', error);
        }
    };

    const onSubmit = async (data: ProductForm) => {
        try {
            setLoading(true);
            const response = await sendRequest<Product>({
                method: 'POST',
                url: '/api/products/create',
                data: JSON.stringify({ ...data, is_active: isActive }),
            });
            router.push(`/kashir/edit-product/${response.id}`);
        } catch (error) {
            console.error('Error creating product:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">إضافة منتج جديد</h1>
                
                <div className="bg-white rounded-xl shadow-md p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-gray-700 font-semibold">
                                اسم المنتج
                            </label>
                            <input
                                {...register('name', { required: 'هذا الحقل مطلوب' })}
                                type="text"
                                className={`w-full px-4 py-3 rounded-lg border ${
                                    errors.name ? 'border-red-500' : 'border-gray-300'
                                } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200`}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1 animate-fadeIn">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-700 font-semibold">
                                الوصف
                            </label>
                            <textarea
                                {...register('description', { required: 'هذا الحقل مطلوب' })}
                                className={`w-full px-4 py-3 rounded-lg border ${
                                    errors.description ? 'border-red-500' : 'border-gray-300'
                                } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200`}
                                rows={4}
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-1 animate-fadeIn">{errors.description.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Select
                                label="الموسم"
                                name="season"
                                options={seasons.map(season => ({
                                    value: season.id,
                                    label: season.name
                                }))}
                                register={register}
                                error={errors.season?.message}
                            />
                        </div>

                        <div className="py-2">
                            <label className="flex items-center space-x-3 space-x-reverse cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                    className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-200 transition duration-150 ease-in-out"
                                />
                                <span className="text-gray-700 font-semibold group-hover:text-gray-900 transition-colors">منتج نشط</span>
                            </label>
                        </div>

                        <div className="flex items-center justify-evenly space-x-4 space-x-reverse pt-6">
                            <button
                                type="button"
                                onClick={() => router.push('/kashir/product-list')}
                                className="px-6 py-3 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200"
                            >
                                إلغاء
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {loading ? 'جاري الحفظ...' : 'حفظ المنتج'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}