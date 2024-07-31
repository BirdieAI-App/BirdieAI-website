import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { sendCode, sendEmail } from "@/libs/request";
import { getProviders, signIn, getCsrfToken } from 'next-auth/react';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

export const useVerification = () => {
    const [verifiedEmail, setVerifiedEmail] = useState('');
    // const [verificationCode, setVerificationCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [popup, setPopup] = useState(0);
    const [validResponse, setValidResponse] = useState(null);
    const router = useRouter();

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

    const handleSubmitEmail = async (event) => {
        event.preventDefault();

        setLoading(true);

        const formData = new FormData(event.target);
        const email = formData.get('email');
        setVerifiedEmail(email);

        try {
            const response = await sendEmail({ email });
            console.log(response);

            setTimeout(() => {
                setLoading(false);
                setPopup(1);
            }, 2000);
        } catch (err) {
            console.error(err);
            setLoading(false);
            toast.error("No account created with your email. Try to signup!")
        }
    };

    const handleSubmitCode = async (event) => {
        event.preventDefault();

        setLoading(true);
        const formData = new FormData(event.target);
        const verificationCode = formData.get('verification-code');
        // const email = verifiedEmail;
        // console.log(verificationCode);

        try {
            const response = await sendCode({ email: verifiedEmail, verificationCode: verificationCode });
            const { email, password } = response;
            let result;
        
            if (password) {
                result = await signIn('credentials', {
                    redirect: false,
                    email,
                    password,
                });
            } else {
                result = await signIn('google', { 
                    redirect: false, 
                    callbackUrl: `/auth/callback?email=${email}` 
                });
            }
        
            console.log('Sign-in result:', result);
        
            if (result?.error) {
                // Handle error if sign-in was not successful
                console.error('Sign-in error:', result.error);
                toast.error("Sign-in failed!");
                setLoading(false);
            } else {
                setTimeout(() => {
                    setLoading(false);
                    router.push("/chat");
                }, 2000);
            }
        } catch (err) {
            console.error('Error during sign-in process:', err);
            toast.error("Your code is invalid or it's expired!");
            setLoading(false); // Ensure loading is stopped in case of error
        }        
    };

    return {
        verifiedEmail, setVerifiedEmail, handleSubmitEmail, popup, setPopup,
        handleSubmitCode, loading, validResponse, setValidResponse, providers, csrfToken, setCsrfToken, setProviders
    };
};
