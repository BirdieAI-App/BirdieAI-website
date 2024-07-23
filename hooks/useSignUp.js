import { useState } from "react";
import { signIn } from "next-auth/react";
import { postUser } from "@/libs/request";
import { z } from "zod";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const useSignUp = function () {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const zObject = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Password must contain at least 8 characters'),
  });

  const toastConfig = {
    autoClose: 6000, // Close after 6 seconds
  };

  const validateData = (payload) => {
    try { 
      zObject.parse(payload);
      return true;
    } catch (error) {
      error.errors.forEach(err => {
        toast.error(err.message, toastConfig);
      });
      return false;
    } 
  }

  const submitHandler = async (event) => {
    event.preventDefault();
    
    const payload = { email, password };
    const isValid = validateData(payload);

    if (!isValid) {
      return;
    }

    try {
      const response = await postUser({ accountData: { email, password } });
      console.log(response);
      const result = await signIn('credentials', {
        redirect: true,
        email,
        password,
      });

      console.log(result);
    } catch (err) {
      console.log(err);
      toast.error('Sign up failed. Please try again.');
    }
  };

  return { setEmail, setPassword, submitHandler, email, password };
}