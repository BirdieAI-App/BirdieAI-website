"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

 export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userProfile] = useState(null);

  const handlePortalRedirect = async () => {
    if (!session || !session.user) {
      console.error('No active session or user');
      alert('Please log in to manage your subscription.');
      return;
    }

    try {
      const response = await fetch('/api/stripe/create-customer-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          returnUrl: window.location.href,
          action: action
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Failed to create customer portal session');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
        <h2 className="text-xl font-semibold mb-4">Billing Information</h2>
        <div className="space-y-4">
          {session && session.user ? (
            <>
          <div className="space-y-4">
        <p>You are currently on a free tier account.</p>
        <button 
          onClick={() => router.push('/plans')}
          className="bg-orange-500 text-white py-2 px-4 rounded-lg"
        >
          Upgrade for less than $10 / month
        </button>
     </div>
          <button 
            onClick={() => handlePortalRedirect('payment')}
            //disabled={loading}
            className="bg-orange-500 text-white py-2 px-4 rounded-lg"
          >
            {loading ? 'Loading...' : 'Cancel Subscription'}
          </button>
            </>
          ) : (
            <p>Please log in to manage your subscription.</p>
          )}
        </div>
      </div>

      <div className="bg-base-200 rounded-xl shadow-xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Credit Card Information</h2>
        <button 
            onClick={() => handlePortalRedirect('payment')}
            //disabled={loading}
            className="bg-orange-500 text-white py-2 px-4 rounded-lg"
          >
            {loading ? 'Loading...' : 'Update Payment Method'}
          </button>
      </div>
    </div>
  );
}

  