import { useState } from "react";
import { signIn } from "next-auth/react";
import { postUser } from "@/libs/request";
// import { z } from "zod";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { validateData } from "@/libs/util";

export const useSignUp = function () {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  
  const submitHandler = async (event) => {
    event.preventDefault();
    
    const payload = { email, password };
    const isValid = validateData(payload);

    if (!isValid) {
      return;
    }

    try {
      const response = await postUser({ accountData: { email, password } });
      // console.log(response);
      const result = await signIn('credentials', {
        redirect: true,
        email,
        password,
      });

      console.log(result);
    } catch (err) {
      // console.log(err);
      // toast.error('Sign up failed. Please try again.');
      if (err.response && err.response.status === 400) {
        toast.error('The email you entered is already in use. Please try with a different email.');
      } else {
        toast.error('Sign up failed. Please try again.');
      }
    }
  };

  return { setEmail, setPassword, submitHandler, email, password };
}