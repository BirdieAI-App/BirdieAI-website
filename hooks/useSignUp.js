import { useState } from "react";
import { signIn } from "next-auth/react";
import { postUser } from "@/libs/request";

export const useSignUp = function () {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const router = useRouter();

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await postUser({ accountData: {email: email, password: password}, profileData: {} });
      console.log(response);
      const result = await signIn('credentials', {
        redirect: true,
        email,
        password,
      });

      console.log(result);
    } catch (err) {
      console.log(err);
    }
  };

  return {setEmail, setPassword, submitHandler, email, password};
}