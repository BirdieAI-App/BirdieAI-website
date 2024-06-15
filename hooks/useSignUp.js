import { useState } from "react";
import { signIn } from "next-auth/react";
import { postUser } from "@/libs/request";

export const useSignUp = function () {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const router = useRouter();

  const submitHandler = async (event) => {
    event.preventDefault();

    const response = await postUser({ email, password });

    if (response.ok) {
      // const data = await response.json();

      const result = await signIn('credentials', {
        redirect: true,
        email,
        password,
      });

      // if (result.ok) {
      //   router.push('/dashboard'); // Redirect to dashboard after sign-in
      // } else {
      //   alert('Sign-in failed');
      // }
    } else {
      const data = await response.json();
      alert(data.message);
    }
  };

  return {setEmail, setPassword, submitHandler, email, password};
}