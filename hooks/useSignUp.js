import { useState } from "react";
import { postUser, SignInLocal } from "@/libs/request";
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
      await postUser({ accountData: { email, password } });
      await SignInLocal({ email, password });
    } catch (err) {
      if (err.response && err.response.status === 400) {
        toast.error('The email you entered is already in use. Please try with a different email.');
      } else {
        toast.error('Sign up failed. Please try again.');
      }
    }
  };

  return { setEmail, setPassword, submitHandler, email, password };
}