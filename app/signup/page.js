"use client"

import { useSignUp } from "@/hooks/useSignUp";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Signup() {
    const { setEmail, setPassword, submitHandler, email, password } = useSignUp();

    return (
        <section className="bg-gray-50">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Create an account
                        </h1>
                        <a
                            href="/call/auth/google"
                            className="flex w-full justify-center py-1.5 border border-slate-200 rounded-lg text-slate-700 my-8 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150"
                        >
                            <img className="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo" />
                            <span className="ml-3">Continue with Google</span>
                        </a>
                        <div className="inline-flex items-center justify-center w-full">
                            <hr className="w-full h-px my-8 bg-gray-200 border-0"/>
                            <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2">or</span>
                        </div>
                        <form className="space-y-4 md:space-y-6" onSubmit={submitHandler}>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 ">Your email</label>
                                <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 
                                text-gray-900 sm:text-sm rounded-lg 
                                focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" 
                                placeholder="name@company.com" required 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 ">Password</label>
                                <input type="password" name="password" id="password" placeholder="••••••••" 
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg 
                                focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            {/* <div>
                                <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                                <input type="confirm-password" name="confirm-password" id="confirm-password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required="" />
                            </div> */}
                            
                            <button type="submit" className="w-full text-white bg-indigo-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                Create an account
                            </button>
                            <div className="flex items-start">
                                {/* <div className="flex items-center h-5">
                                <input id="terms" aria-describedby="terms" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required />
                                </div> */}
                                <div className="text-sm">
                                <label htmlFor="terms" className="font-light text-gray-500">By creating an account, I accept the <span><a className="font-medium text-primary-600 hover:underline" href="#">Terms and Conditions</a></span></label>
                                </div>
                            </div>
                            <p className="text-sm font-light text-gray-500">
                                Already have an account? 
                                <span><Link href="/api/auth/signin" className="font-medium text-indigo-600"> Login here</Link>
                                </span>
                            </p>
                        </form>
                        <ToastContainer />
                    </div>
                </div>
            </div>
        </section>)
}