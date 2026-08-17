import { useEffect } from "react";
import { useRouter } from "next/router";

/** Régi /profile útvonal → dashboard tanulás / profil nézet */
export default function ProfileRedirect() {
    const router = useRouter();

    useEffect(() => {
        void router.replace("/dashboard?tab=tanulas");
    }, [router]);

    return (
        <div
            style={{
                minHeight: "40vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#39ff14",
            }}
        >
            Átirányítás a dashboardra…
        </div>
    );
}
