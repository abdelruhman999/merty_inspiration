"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Select } from "@/component/Select/Select";
import { sendRequest } from "@/api";
import useRequest from "@/hooks/call";
import Swal from "sweetalert2";

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

export default function EditProduct({ id }: { id: string }) {
    const router = useRouter();
    const [is_active, setIsActive] = useState(false);
    const {data , loading , error} = useRequest<Season[]>({
        url: `/api/seasons`,
        method: 'GET',
    },[]);
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        getValues
    } = useForm<ProductForm>();


    useEffect(() => {
        sendRequest<ProductForm>({
            method: "GET",
            url: `/api/products/${id}`,
        })
            .then((response) => {
                setValue("name", response.name);
                setValue("description", response.description);
                setValue("season", response.season);
                setValue("is_active", response.is_active);
                setIsActive(response.is_active);
            })
            .catch((error) => {
                console.error("Error fetching product:", error);
            });
    }, [id]);

    const onSubmit = async (data: ProductForm) => {
        sendRequest<ProductForm>({
            method: "PUT",
            url: `/api/products/${id}`,
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify({ ...data }),
        })
            .then((response) => {
                // router.push("/kashir/product-list");
                setValue("name", response.name);
                setValue("description", response.description);
                setValue("season", response.season);
                setValue("is_active", response.is_active);
                setIsActive(response.is_active);

                Swal.fire({
                    icon: 'success',
                    text: 'تم تعديل المنتج بنجاح',
                    showConfirmButton: false,
                    timer: 1000
                });

            })
            .catch((error) => {
                Swal.fire({
                    icon: 'error',
                    text: `حدث خطأ عند تعديل المنتج: ${error}`,
                    showConfirmButton: false,
                    timer: 1000
                })
            });
    };

    if (loading) {
        return <div className="p-6 text-center">جاري التحميل...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                تعديل المنتج
            </h1>

            <div className="bg-white rounded-xl shadow-md p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
                    <div className="col-span-1 w-full ">
                        <label className="block w-full text-center p-2 text-gray-700 font-semibold">
                            اسم المنتج
                        </label>
                        <input
                            {...register("name", {
                                required: "هذا الحقل مطلوب",
                            })}
                            type="text"
                            className={`w-full px-4 py-3 rounded-lg border ${
                                errors.name
                                    ? "border-red-500"
                                    : "border-gray-300"
                            } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200`}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1 animate-fadeIn">
                                {errors.name.message}
                            </p>
                        )}
                    </div>
                    <div className="col-span-1 w-full">
                        <Select
                            label="الموسم"
                            name="season"
                            options={data?.map((season) => ({
                                value: season.id,
                                label: season.name,
                            })) || []}
                            register={register}
                            error={errors.season?.message}
                        />
                    </div>
 
                    <div className="space-y-2 col-span-2">
                        <label className="block text-gray-700 font-semibold">
                            الوصف
                        </label>
                        <textarea
                            {...register("description", {
                                required: "هذا الحقل مطلوب",
                            })}
                            className={`w-full px-4 py-3 rounded-lg border ${
                                errors.description
                                    ? "border-red-500"
                                    : "border-gray-300"
                            } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200`}
                            rows={4}
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1 animate-fadeIn">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    <div className="py-2">
                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer "
                                {...register("is_active")}
                            />

                            <div 
                            className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600" />
                            <span className="ms-3 text-lg font-medium text-black ">
                                المنتج نشط
                            </span>
                        </label>
                    </div>

                    <div className="flex items-center justify-evenly space-x-4 space-x-reverse pt-6">
                        <button
                            type="button"
                            onClick={() => router.push("/kashir/product-list")}
                            className="px-6 py-3 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
