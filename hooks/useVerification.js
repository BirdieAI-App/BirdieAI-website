import { useRouter } from "next/navigation";
import { useState } from "react";
import { sendCode, sendEmail } from "@/libs/request";
import { getProviders, signIn } from 'next-auth/react';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

export const useVerification = () => {
    const [verifiedEmail, setVerifiedEmail] = useState('');
    // const [verificationCode, setVerificationCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [popup, setPopup] = useState(0);
    const [validResponse, setValidResponse] = useState(null);
    const router = useRouter();

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
            }, 3000);
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
        const email = verifiedEmail;
        console.log(verificationCode);

        try {
            const response = await signIn('credentials', {
                redirect: false,
                email,
                verificationCode
            });
            console.log(response);

            if (response.error) {
                // const err = JSON.parse(response.error);
                setLoading(false);
                toast.error("Expired verification code!");
            } else {
                setTimeout(() => {
                    setLoading(false);
                    router.push("/chat");
                }, 2000);
            }

        } catch (err) {
            console.error(err);
            setLoading(false); // Ensure loading is stopped in case of error
        }
    };

    return { verifiedEmail, setVerifiedEmail, handleSubmitEmail, popup, setPopup, 
        handleSubmitCode, loading, validResponse, setValidResponse };
};
