'use client';
import React from 'react';
import { FieldValues, Path, UseFormRegister } from 'react-hook-form';

interface Option {
    value: string;
    label: string;
}

interface SelectProps<T extends FieldValues> {
    label: string;
    name: Path<T>;
    options: Option[];
    register: UseFormRegister<T>;
    error?: string;
    className?: string;
}

export function Select<T extends FieldValues>({
    label,
    name,
    options,
    register,
    error,
    className = '',
}: SelectProps<T>) {
    return (
        <div className={`space-y-2 ${className}`}>
            <label className="block text-gray-700 text-center p-2 font-semibold" htmlFor={name}>
                {label}
            </label>
            <select
                {...register(name)}
                className={`w-full px-4 py-3 rounded-lg border ${
                    error ? 'border-red-500' : 'border-gray-300'
                } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200`}
                id={name}
            >
                <option value="">اختر...</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p className="text-red-500 text-sm mt-1 animate-fadeIn">{error}</p>}
        </div>
    );
}
