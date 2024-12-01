"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { usePayment } from '@/hooks/usePayment';

 export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { handleCustomerPortal, isLoading } = usePayment();
  const [userId, setUserId] = useState();

  useEffect(() => {
    // if (status !== "loading" && !session) {
    //   router.push(config.auth.loginUrl);
    //   // console.log('a');
    // }
    if (session && session.user.userId) {
      setUserId(session.user.userId);
    }
  }, [session, status]);
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!session) {
    router.push("/");
    return null;
  }
  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Your Profile</h1>
      
      <div className="bg-base-200 rounded-xl shadow-xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium opacity-70">Name</label>
            <p className="text-lg font-semibold">{session.user?.name || "Not provided"}</p>
          </div>
          <div>
            <label className="text-sm font-medium opacity-70">Email</label>
            <p className="text-lg font-semibold">{session.user?.email || "Not provided"}</p>
          </div>
        </div>
      </div>

      <div className="bg-base-200 rounded-xl shadow-xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Plan Details</h2>
        <div className="space-y-4">
          {session && session.user ? (
            <>
          <div className="space-y-4">
        <p>Learn more about your current plan here.</p>
     </div>
          <button 
            onClick={() => userId ? handleCustomerPortal({ userId }) : ''}
            className="bg-orange-500 text-white py-2 px-4 rounded-lg"
          >
            Manage Subscription
          </button>
            </>
          ) : (
            <p>Please log in to manage your subscription.</p>
          )}
        </div>
      </div>

      <div className="bg-base-200 rounded-xl shadow-xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Billing Info</h2>
        <button 
            onClick={() => userId ? handleCustomerPortal({ userId }) : ''}
            className="bg-orange-500 text-white py-2 px-4 rounded-lg"
          >
            Update Payment Method
          </button>
      </div>
      <button
        onClick={() => router.push('/chat')}
        className="flex items-center justify-center w-full gap-2 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg transition-colors"
      >
        ← Back to Chat
      </button>
    </div>
  );
}
  
