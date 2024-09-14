/*import ButtonAccount from "@/components/ButtonAccount";

export const dynamic = "force-dynamic";

// This is a private page: It's protected by the layout.js component which ensures the user is authenticated.
// It's a server compoment which means you can fetch data (like the user profile) before the page is rendered.
// See https://shipfa.st/docs/tutorials/private-page
export default async function Profile() {
  return (
    <main className="min-h-screen p-8 pb-24">
      <section className="max-w-xl mx-auto space-y-8">
        <ButtonAccount />
        <h1 className="text-3xl md:text-4xl font-extrabold">Profile Page </h1>
      </section>
    </main>
  );
}
*/

//This works
/*"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Display loading state while checking authentication
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  // Redirect to home if the user is not authenticated
  if (!session) {
    router.push("/"); // Redirect to home if not authenticated
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      <div className="bg-base-200 p-6 rounded-lg shadow-md">
        <p className="mb-2">
          <strong>Name:</strong> {session.user?.name || "Not provided"}
        </p>
        <p className="mb-2">
          <strong>Email:</strong> {session.user?.email || "Not provided"}
        </p>
      </div>
    </div>
  );
}
*/

"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Display loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Redirect to home if the user is not authenticated
  if (!session) {
    router.push("/");
    return null;
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">My Profile</h1>
      <div className="bg-base-200 rounded-xl shadow-xl p-6">
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
    </div>
  );
}
  