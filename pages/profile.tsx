import { useEffect } from "react";
import { useRouter } from "next/router";

/** Régi /profile útvonal → egyesített dashboard profil fül */
export default function ProfileRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/dashboard?tab=profil");
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
