import { useRouter } from "next/navigation";
import { useState } from "react";
import { sendEmail } from "@/libs/request";

export const useVerification = function() {
    const [verifiedEmail, setVerifiedEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [popup,setPopup] = useState(0);

    const handleSubmitEmail = async (event) => {
        event.preventDefault();

        setLoading(true);

        const formData = new FormData(event.target);
        const email = formData.get('email');
        setVerifiedEmail(email);

        const response = await sendEmail({email, userId: "66a480484dec7af6a9221585"});
        // console.log(response);

        setTimeout(() => 
        {
            setLoading(false);
            setPopup(1);
        },3000);


        // if (res.error) {
        //     toast.error('The email you entered does not exist. Please try with a different email.');
        // } else {
        //     router.push("/chat");
        // }
    };

    const handleChange = (e) => {
        setVerificationCode(e.target.value);
    };

    const handleSubmitCode = async(e) => {
        
    }

    console.log(verifiedEmail);

    return {verificationCode, verifiedEmail, setVerifiedEmail, setVerificationCode, handleSubmitEmail, handleChange, popup, setPopup, handleSubmitCode,loading}
}