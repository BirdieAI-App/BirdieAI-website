"use client"

import { useEffect, useState } from 'react';
import { getProviders, signIn } from 'next-auth/react';
import Link from 'next/link';
import { getCsrfToken } from "next-auth/react";

export default function SignIn() {
    const [providers, setProviders] = useState(null);
    const [csrfToken, setCsrfToken] = useState("");

    useEffect(() => {
        async function fetchProviders() {
            const res = await getProviders();
            setProviders(res);
            console.log(res);
        }

        const fetchCsrfToken = async () => {
            const token = await getCsrfToken();
            setCsrfToken(token);
        };
          
        fetchCsrfToken();
        fetchProviders();
    }, []);

    if (!providers) {
        return <div>Loading...</div>;
    } 

    return (
        <div className="flex items-center flex-col justify-center">
            <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                <img class="mx-auto h-10 w-auto" src="icon.png" alt="" />
                <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
            </div>

            <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                {providers.credentials && 
                (<form class="space-y-6" method="post" action="/api/auth/callback/credentials">
                    <input name="csrfToken" type="hidden" defaultValue={csrfToken}/>
                    <div>
                        <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                        <div class="mt-2">
                            <input id="email" name="email" type="email" autocomplete="email" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        </div>
                    </div>

                    <div>
                        <div class="flex items-center justify-between">
                            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
                            <div class="text-sm">
                                <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
                            </div>
                        </div>
                        <div class="mt-2">
                            <input id="password" name="password" type="password" autocomplete="current-password" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        </div>
                    </div>

                    <div>
                        <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
                    </div>
                </form>)}
                {providers.google && (
                <button className="flex w-full justify-center py-1.5 border border-slate-200 rounded-lg text-slate-700 my-8 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150"
                onClick={() => signIn(providers.google.id)}>
                    <img className="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo" />
                    <span className='ml-3'> Continue with Google</span>
                </button>
                
                )}
                {/* {providers.credentials} */}
                <p class="mt-10 text-center text-sm text-gray-500">
                    Not a member?
                    <Link href="/api/auth/signup" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"> Create account </Link>
                </p>
            </div>
            
        </div>
    );
}
