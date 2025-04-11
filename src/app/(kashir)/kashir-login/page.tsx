'use client';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { sendRequest } from '@/api';


type FormData = {
    username: string;
    password: string;
};


interface LoginProps {}

const Login: FC<LoginProps> = () => {
    const { register,reset, handleSubmit, formState: { errors, isSubmitting} } = useForm<FormData>();
    const router = useRouter();
    const onSubmit = async (data: FormData) => {
        const { username, password } = data;
        sendRequest({
            method: 'POST',
            url: '/api/login',
            data: JSON.stringify({ username, password }),
        })
        .then((response) => {
            router.push('/kashir'); 
        })
        .catch((error) => {
            console.error('Login failed:', error);
            alert('Login failed. Please check your credentials.');
            reset();
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg ">
            <div className='w-full flex justify-center'>
                <h2 className="mb-6 border-b w-fit text-center text-2xl font-bold">Admin Login</h2>
            </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="username"
                {...register('username', { required: 'Username is required' })}
                className="mt-1 w-full rounded-md border px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
              {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>}
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                {...register('password', { required: 'Password is required' })}
                className="mt-1 w-full rounded-md border px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
            </div>
  
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
}

export default Login;
