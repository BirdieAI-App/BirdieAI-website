"use client";

import DRICalculator from "@/components/DRICalculator";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const DRIPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [userId, setUserId] = useState();

    useEffect(() => {

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
        <div className="flex items-center justify-center">
            <DRICalculator />
        </div>
    )
}

export default DRIPage;