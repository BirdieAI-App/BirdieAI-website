"use client"

import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

export default function ForgotPassword() {
    const router = useRouter();
    const [loading, setLoading] = useState();

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);

        const formData = new FormData(event.target);
        const email = formData.get('email');
        // const password = formData.get('password');

        // const res = await signIn('credentials', {
        //     redirect: false,
        //     email,
        //     password
        // });
        console.log(email);

        setTimeout(() => 
        {
            router.push('/forgot-password/verification');
        },1000);

        // if (res.error) {
        //     toast.error('The email you entered does not exist. Please try with a different email.');
        // } else {
        //     router.push("/chat");
        // }
    };
    return (
        <section className="bg-gray-50">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                    <div className="p-8 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl"> Forgot your password? </h1>
                        <p className="mt-10 text-center text-sm text-gray-500">
                            Don't fret! Just type in your email and we will send you a verification code!
                        </p>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                            <div className="mt-2">
                                <input id="email" name="email" type="email" autoComplete="email"
                                    required className="pl-2 bg-white block w-full rounded-md border border-gray-300 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    placeholder="name@company.com"
                                />
                            </div>
                            <div>
                                <button type="submit" className="flex w-full justify-center rounded-md mt-6 bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    disabled={loading}>
                                    {loading ? 'Sending code...' : 'Send code'}
                                </button>
                            </div>
                        </form>
                        {/* <p className="mt-10 text-center text-sm text-gray-500">
                            <Link href="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"> Back to sign in </Link>
                        </p> */}
                        <button className="flex w-full justify-center rounded-md bg-white px-3 py-1.5 text-sm font-semibold leading-6 text-indigo-600 shadow-sm hover:bg-gray-200 border border-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            onClick={() => router.push("/api/auth/signin")}>
                            {/* <Link href="/api/auth/signin"> Back to sign in </Link> */}
                            Back to sign in
                        </button>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </section>
    )
}