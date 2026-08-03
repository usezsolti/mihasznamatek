import { useEffect } from "react";
import { useRouter } from "next/router";

/** Angol / régi útvonal → magyar adatkezelési tájékoztató */
export default function PrivacyRedirect() {
    const router = useRouter();
    useEffect(() => {
        router.replace("/adatkezelesi-tajekoztato");
    }, [router]);
    return null;
}
