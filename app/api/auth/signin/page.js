"use client"

import { useEffect, useState } from 'react';
import { getProviders, signIn } from 'next-auth/react';
import Link from 'next/link';
import { getCsrfToken } from "next-auth/react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import { validateData } from '@/libs/util';
import { SignInGoogle } from '@/libs/request';

export default function SignIn() {
    // const [providers, setProviders] = useState(null);
    // const [csrfToken, setCsrfToken] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // useEffect(() => {
    //     async function fetchProviders() {
    //         const res = await getProviders();
    //         setProviders(res);
    //         // console.log(res);
    //     }

    //     const fetchCsrfToken = async () => {
    //         const token = await getCsrfToken();
    //         setCsrfToken(token);
    //     };
          
    //     fetchCsrfToken();
    //     fetchProviders();
    // }, []);

    // if (!providers) {
    //     return <div>Loading...</div>;
    // } 

    // const handleSubmit = async (event) => {
    //     event.preventDefault();

    //     setLoading(true);

    //     const formData = new FormData(event.target);
    //     const email = formData.get('email');
    //     const password = formData.get('password');

    //     if (!validateData({email,password})) {
    //         setTimeout(setLoading(false),500);
    //         return;
    //     }

    //     const res = await signIn('credentials', {
    //         redirect: false,
    //         email,
    //         password
    //     });

    //     // console.log(res);

    //     if (res.error) {
    //         // const err = JSON.parse(res.error);
    //         setLoading(false);
    //         toast.error("Your email does not exist OR your password does not match. Please retry!");
    //     } else {
    //         setTimeout(() => {
    //             setLoading(false);
    //             router.push("/chat");
    //         }, 2000);
    //     }
    // };

    const handleSignInWithGoogle = async () =>{
        try{
            const response = await SignInGoogle();
        }catch(err){
            console.log(err.message);
        }
    }

    return (
        <section className="bg-gray-50">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">Sign in to your account</h1>
                            <button className="flex w-full justify-center py-1.5 border border-slate-200 rounded-lg text-slate-700 my-8 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150"
                            onClick={() => handleSignInWithGoogle()}>
                                <img className="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo" />
                                <span className='ml-3'> Continue with Google</span>
                            </button>
                        <div className="inline-flex items-center justify-center w-full">
                            <hr className="w-full h-px my-8 bg-gray-200 border-0"/>
                            <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2">or</span>
                        </div>
                            <form className="space-y-6" method="post" onSubmit={console.log("submit credentials")}>
                                <input name="csrfToken" type="hidden"/>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                                    <div className="mt-2">
                                        <input id="email" name="email" type="email" autoComplete="email" 
                                        required className="pl-2 bg-white block w-full rounded-md border border-gray-300 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
                                        placeholder="name@company.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                                        <div className="text-sm">
                                            <Link href="/forgot-password" className="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</Link>
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <input id="password" name="password" type="password" autoComplete="current-password" 
                                        required className="pl-2 bg-white block w-full rounded-md border border-gray-300 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
                                        placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    disabled={loading}>
                                    {loading ? 'Signing in...' : 'Sign in'}
                                    </button>
                                </div>
                            </form>
                        <p className="mt-10 text-center text-sm text-gray-500">
                            Not a member?
                            <Link href="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"> Create account </Link>
                        </p>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </section>
    );
}
