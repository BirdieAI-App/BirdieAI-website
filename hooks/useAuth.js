import { useEffect } from "react";
import { useSession } from "next-auth/react";

export const useAuth = function () {
    const { data: session, status } = useSession();

    const sendGoogleToken = async (idToken) => {
        console.log("generate token!")
        const response = await fetch('/api/auth/google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idToken }),
        });
    
        const data = await response.json();
        console.log(data);
      };
    
    useEffect(() => {
        if (session) {
          sendGoogleToken(session.idToken);
        }
    }, [])
}