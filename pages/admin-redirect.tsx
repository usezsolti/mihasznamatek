import { useEffect } from "react";
import { useRouter } from "next/router";

export default function AdminRedirect() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to the new admin dashboard
        router.replace("/admin-dashboard");
    }, [router]);

    return (
        <div className="dashboard-container dark-theme">
            <div className="loading-screen">
                <p>Átirányítás az admin felületre...</p>
            </div>
        </div>
    );
}


