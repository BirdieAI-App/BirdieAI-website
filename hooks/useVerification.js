import { useRouter } from "next/navigation";
import { useState } from "react";
import { sendCode, sendEmail } from "@/libs/request";

export const useVerification = () => {
    const [verifiedEmail, setVerifiedEmail] = useState('');
    // const [verificationCode, setVerificationCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [popup, setPopup] = useState(0);
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
        }
    };

    const handleSubmitCode = async (event) => {
        event.preventDefault();

        setLoading(true);
        const formData = new FormData(event.target);
        const verificationCode = formData.get('verification-code');
        // const email = formData.get('email');
        // console.log({email: verifiedEmail, verificationCode});

        try {
            const response = await sendCode({ email: verifiedEmail,verificationCode });
            console.log(response);

            setTimeout(() => {
                setLoading(false);
                // router.push('/chat');
            }, 3000);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    return { verifiedEmail, setVerifiedEmail, handleSubmitEmail, popup, setPopup, handleSubmitCode, loading };
};
