"use client"

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import { useVerification } from '@/hooks/useVerification';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getCsrfToken } from 'next-auth/react';
import { getProviders } from 'next-auth/react';

export default function ForgotPassword() {
    const router = useRouter();
    const {
        verifiedEmail,
        handleSubmitEmail,
        loading,
        popup,
        verificationCode,
        setPopup,
        handleSubmitCode,
        validResponse,
        setValidResponse
    } = useVerification();
    const [providers, setProviders] = useState(null);
    const [csrfToken, setCsrfToken] = useState("");

    useEffect(() => {
        async function fetchProviders() {
            const res = await getProviders();
            setProviders(res);
            // console.log(res);
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
        <section className="flex flex-col items-center justify-center bg-gray-50 mx-auto md:h-screen">
            {popup === 0 ? (
                <div>
                    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                            <div className="p-8 space-y-4 md:space-y-6 sm:p-8">
                                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl"> Forgot your password? </h1>
                                <p className="mt-10 text-center text-sm text-gray-500">
                                    Don't fret! Just type in your email and we will send you a verification code!
                                </p>
                                <form onSubmit={handleSubmitEmail}>
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
                                <button className="flex w-full justify-center rounded-md bg-white px-3 py-1.5 text-sm font-semibold leading-6 text-indigo-600 shadow-sm hover:bg-gray-200 border border-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    onClick={() => router.push("/api/auth/signin")}>
                                    Back to sign in
                                </button>
                            </div>
                        </div>
                    </div>
                    <ToastContainer />
                </div>
            ) : (
                <div className="max-w-md w-full bg-white p-8 rounded shadow">
                    <h2 className="text-2xl font-bold mb-2 text-left">Check your email</h2>
                    <p className="text-gray-600 text-left mb-6">to continue to Birdie</p>

                    <div className="flex flex-row bg-gray-300 w-2/3 rounded-lg p-2 mb-4">
                        <span className="text-black text-left basis-3/4">{verifiedEmail}</span>
                        <button onClick={() => setPopup(0)} className="text-indigo-600 basis-1/4 text-right">
                            Edit
                        </button>
                    </div>
                    {providers.credentials && (
                    <form onSubmit={handleSubmitCode} method="post" className="mb-4 mt-10">
                        <input name="csrfToken" type="hidden" defaultValue={csrfToken}/>
                        <label htmlFor="verification-code" className="block text-sm font-bold text-gray-700">Verification code</label>
                        <input
                            type="text"
                            id="verification-code"
                            name="verification-code"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
                        />
                        <button
                            type="submit"
                            className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                            disabled={loading}
                        >
                            {loading ? "Verifying code..." : "Verify code"}
                        </button>
                    </form>)}
                    <div className="text-center">
                        <button
                            onClick={() => setPopup(0)}
                            className="text-sm text-indigo-600 hover:underline"
                        >
                            Didn't receive a code? Resend
                        </button>
                        <div className="mt-4">
                            <Link href="/api/auth/signin" className="text-sm text-indigo-600 hover:underline">
                                Use another method
                            </Link>
                        </div>
                    </div>
                    <ToastContainer />
                </div>
            )}
        </section>
    );
}
