"use client"

import { useEffect, useState } from 'react';
import { getProviders, signIn } from 'next-auth/react';
import ButtonSignin from '@/components/ButtonSignin';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useSession } from 'next-auth/react';

export default function SignIn() {
    const [providers, setProviders] = useState(null);
    const { data: session, status } = useSession();

    useEffect(() => {
        async function fetchProviders() {
            const res = await getProviders();
            setProviders(res);
        }

        fetchProviders();
    }, []);

    // const sendGoogleToken = async (idToken) => {
    //     // console.log("generate token!")
    //     const response = await fetch('/api/auth/google', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({ idToken }),
    //     });
    
    //     const data = await response.json();
    //     console.log(data);
    //   };
    

    if (!providers) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex items-center flex-col justify-center">
            {providers.google && (
                <button className="px-4 py-2 border flex gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150"
                onClick={() => signIn(providers.google.id)}>
                    <img className="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo" />
                    <span>Login with Google</span>
                </button>
                
            )}
            <div>
                <Link href="/api/auth/signup">Sign Up</Link>
            </div>
        </div>
    );
}

