import { useState, useCallback } from "react";
import { createCheckoutSession, createCustomerPortalSession, getProductList,getStripePrice } from "@/libs/request";

export function usePayment() {
    const [isLoading, setIsLoading] = useState(false);

    const handlePayment = async (payload) => {
        // redirect to Signin Page if user is not logged in
        const { priceId, userId } = payload;

        setIsLoading(true);
        try {
            const res = await createCheckoutSession({
                priceId,
                userId,
                successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/chat?stripeRedirect=true`,
                cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/plans`,
            });
            sessionStorage.setItem('checkoutSessionID', res.checkoutSessionId);
            window.location.href = res?.url;
            // console.log(res);
        } catch (e) {
            console.log(e.message);
        }

        setIsLoading(false);
    }

    const handleCustomerPortal = async (payload) => {
        const { userId } = payload;
        setIsLoading(true); 
        try {
            const res = await createCustomerPortalSession({
                userId,
                returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/profile`
            });
            window.location.href = res?.url;
        } catch (e) {
            console.log(e.message);
        }
        setIsLoading(false);
    }

    const handleStripeProductList = useCallback( async() => {
        try{
            const response = await getProductList();
            return response;
        }catch(e){
            console.log(e.message);
        }
    },[]);

    const handleGetStripPRice = async(priceID) =>{
        try{
            const response = await getStripePrice(priceID);
            return response;
        }catch(e){
            console.log(e.message)
        }
    }

    return {isLoading, handlePayment, handleCustomerPortal, handleStripeProductList, handleGetStripPRice};
}