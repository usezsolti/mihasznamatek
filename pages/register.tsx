// frontend/pages/register.tsx
import Head from "next/head";
import Script from "next/script";
import Link from "next/link";
import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/router";
import CookieBanner from "../components/CookieBanner";

// UID generáló függvény
const generateUID = (): string => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 15);
    return `user_${timestamp}_${randomStr}`;
};

// Verifikációs e-mail küldő függvény
const sendVerificationEmail = async (email: string, name: string, uid: string) => {
    try {
        console.log("Verifikációs e-mail küldés kezdeményezve:", { email, name, uid });

        // EmailJS removed - using simple console log instead
        console.log("Verifikációs e-mail küldés szimulálva:", { email, name, uid });

        // Token mentése localStorage-ba (ideiglenes megoldás)
        const verificationToken = btoa(`${uid}_${Date.now()}`);
        const pendingVerifications = JSON.parse(localStorage.getItem('pending_verifications') || '[]');
        pendingVerifications.push({
            email,
            uid,
            token: verificationToken,
            createdAt: new Date().toISOString()
        });
        localStorage.setItem('pending_verifications', JSON.stringify(pendingVerifications));

        console.log("Verifikációs e-mail sikeresen elküldve (szimulálva)");
        return true;
    } catch (error: unknown) {
        console.error("Verifikációs e-mail küldési hiba:", error);
        console.error("Hiba részletek:", {
            message: error?.message || 'Ismeretlen hiba',
            stack: error?.stack || 'Nincs stack trace',
            email,
            name,
            uid
        });
        return false;
    }
};

// Admin adatbázis kezelő
const addUserToAdminDB = (userData: {
    uid: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    educationLevel: string;
    helpDescription: string;
    hobby: string;
    profileImage?: string;
}) => {
    try {
        // Meglévő felhasználók betöltése
        const existingUsers = localStorage.getItem('admin_users');
        const users = existingUsers ? JSON.parse(existingUsers) : [];

        // Új felhasználó hozzáadása
        const newUser = {
            uid: userData.uid,
            name: userData.name,
            email: userData.email,
            password: userData.password, // Jelszó tárolása
            course: 'Matematika', // Alapértelmezett kurzus
            address: userData.address,
            educationLevel: userData.educationLevel,
            helpDescription: userData.helpDescription,
            hobby: userData.hobby,
            profileImage: userData.profileImage || '',
            createdAt: new Date().toISOString()
        };

        // Ellenőrizzük, hogy nincs-e már ilyen email
        const existingUser = users.find((user: { email: string }) => user.email === userData.email);
        if (!existingUser) {
            users.push(newUser);
            localStorage.setItem('admin_users', JSON.stringify(users));
            console.log('Felhasználó hozzáadva az admin adatbázishoz:', newUser);
        } else {
            console.log('Felhasználó már létezik:', userData.email);
        }
    } catch (error) {
        console.error('Hiba az admin adatbázis frissítésekor:', error);
    }
};

export default function Register() {
    const router = useRouter();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPass] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [educationLevel, setEducationLevel] = useState("");
    const [helpDescription, setHelpDescription] = useState("");
    const [hobby, setHobby] = useState("");
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [profileImagePreview, setProfileImagePreview] = useState<string>("");
    const [showCropper, setShowCropper] = useState(false);
    const [originalImage, setOriginalImage] = useState<string>("");
    const [cropPosition, setCropPosition] = useState({ x: 0, y: 0, scale: 1 });
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: '' });
    const [selectedCountryCode, setSelectedCountryCode] = useState('+36');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [city, setCity] = useState('');
    const [isCityLoading, setIsCityLoading] = useState(false);
    const [street, setStreet] = useState('');
    const [houseNumber, setHouseNumber] = useState('');
    const [apartment, setApartment] = useState('');
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [msg, setMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // EmailJS removed - using dashboard notifications only

    const handleGoogleRegister = async () => {
        setLoading(true);
        setMsg(null);

        try {
            // Firebase inicializálás ellenőrzése
            if (typeof window !== 'undefined' && window.firebase) {
                const provider = new window.firebase.auth.GoogleAuthProvider();
                provider.addScope('profile');
                provider.addScope('email');

                const result = await window.firebase.auth().signInWithPopup(provider);

                if (result.user) {
                    const uid = result.user.uid;
                    const name = result.user.displayName || '';
                    const email = result.user.email || '';

                    // Firestore-ba mentés
                    const db = window.firebase.firestore();
                    await db.collection('users').doc(uid).set({
                        name,
                        email,
                        photoURL: result.user.photoURL || '',
                        provider: 'google',
                        createdAt: window.firebase.firestore.FieldValue.serverTimestamp(),
                        lastLogin: window.firebase.firestore.FieldValue.serverTimestamp()
                    }, { merge: true });

                    // Admin adatbázisba is mentés
                    addUserToAdminDB({
                        uid,
                        name,
                        email,
                        password: 'google_oauth', // OAuth esetén nincs jelszó
                        phone: '',
                        address: '',
                        educationLevel: '',
                        helpDescription: '',
                        hobby: '',
                        profileImage: result.user.photoURL || ''
                    });

                    setMsg("Sikeres regisztráció Google fiókkal!");
                    router.push('/dashboard');
                } else {
                    setMsg("Google regisztráció sikertelen.");
                }
            } else {
                setMsg("Firebase nem elérhető. Kérjük, frissítsd az oldalt.");
            }
        } catch (error: any) {
            console.error("Google regisztráció hiba:", error);
            if (error.code !== 'auth/popup-closed-by-user') {
                setMsg(error?.message || "Google regisztráció sikertelen.");
            }
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMsg(null);

        // Jelszó validáció - minden paraméter kötelező
        const passwordValidation = checkPasswordStrength(password);
        const hasMinLength = password.length >= 8;
        const hasLowerCase = /[a-z]/.test(password);
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (!hasMinLength || !hasLowerCase || !hasUpperCase || !hasNumber || !hasSpecialChar) {
            setMsg("A jelszónak tartalmaznia kell: legalább 8 karaktert, kisbetűt, nagybetűt, számot és speciális karaktert!");
            setLoading(false);
            return;
        }

        // Telefonszám validáció
        const phoneValidation = validatePhoneNumber(selectedCountryCode, phoneNumber);
        if (!phoneValidation.isValid) {
            setMsg(phoneValidation.message);
            setLoading(false);
            return;
        }

        // Cím validáció
        if (!postalCode.trim() || !city.trim() || !street.trim() || !houseNumber.trim()) {
            setMsg("Az irányítószám, város, utca és házszám kötelező mezők!");
            setLoading(false);
            return;
        }

        // Szabályzat elfogadás validáció
        if (!acceptedTerms) {
            setMsg("A szabályzat elfogadása kötelező a regisztrációhoz!");
            setLoading(false);
            return;
        }

        try {
            // UID generálása
            const uid = generateUID();

            // Firebase regisztráció
            if (typeof window !== "undefined" && window.firebase) {
                try {
                    const auth = window.firebase.auth();
                    const userCredential = await auth.createUserWithEmailAndPassword(email, password);

                    // Profil frissítése
                    const fullName = `${firstName} ${lastName}`.trim();
                    await userCredential.user?.updateProfile({ displayName: fullName });

                    // Felhasználó hozzáadása az admin adatbázishoz
                    const fullAddress = `${postalCode} ${city}, ${street} ${houseNumber}${apartment ? ` ${apartment}` : ''}`.trim();

                    addUserToAdminDB({
                        uid,
                        name: fullName,
                        email,
                        password,
                        phone: selectedCountryCode + phoneNumber,
                        address: fullAddress,
                        educationLevel,
                        helpDescription,
                        hobby,
                        profileImage: profileImagePreview
                    });

                    // Verifikációs e-mail küldése
                    const emailSent = await sendVerificationEmail(email, fullName, uid);

                    if (emailSent) {
                        setMsg("Sikeres regisztráció! Kérlek ellenőrizd az e-mail fiókod a verifikációhoz!");
                        setTimeout(() => router.push('/verify-email'), 3000);
                    } else {
                        setMsg("Regisztráció sikeres, de a verifikációs e-mail küldése nem sikerült. Kérlek próbáld újra később.");
                        setTimeout(() => router.push('/dashboard'), 3000);
                    }
                } catch (firebaseError: unknown) {
                    console.error("Firebase Auth hiba:", firebaseError);

                    // Ha a felhasználó már létezik, csak hozzáadjuk az admin adatbázishoz
                    if (firebaseError.code === 'auth/email-already-in-use') {
                        const fullName = `${firstName} ${lastName}`.trim();
                        const fullAddress = `${postalCode} ${city}, ${street} ${houseNumber}${apartment ? ` ${apartment}` : ''}`.trim();

                        addUserToAdminDB({
                            uid,
                            name: fullName,
                            email,
                            password,
                            phone: selectedCountryCode + phoneNumber,
                            address: fullAddress,
                            educationLevel,
                            helpDescription,
                            hobby,
                            profileImage: profileImagePreview
                        });

                        setMsg("A felhasználó már létezik! Bejelentkezhetsz a meglévő fiókkal, vagy kérjük az adminisztrátort a verifikációhoz.");
                        setTimeout(() => router.push('/'), 3000);
                    } else {
                        setMsg("Hiba történt a regisztráció során: " + firebaseError.message);
                    }
                }
            } else {
                // Ha nincs Firebase, csak az admin adatbázishoz adjuk hozzá
                const fullName = `${firstName} ${lastName}`.trim();
                const fullAddress = `${postalCode} ${city}, ${street} ${houseNumber}${apartment ? ` ${apartment}` : ''}`.trim();

                addUserToAdminDB({
                    uid,
                    name: fullName,
                    email,
                    password,
                    phone: selectedCountryCode + phoneNumber,
                    address: fullAddress,
                    educationLevel,
                    helpDescription,
                    hobby,
                    profileImage: profileImagePreview
                });

                setMsg("Sikeres regisztráció! (Firebase nélkül) Átirányítás...");
                setTimeout(() => router.push('/dashboard'), 2000);
            }
        } catch (err: unknown) {
            console.error('Regisztrációs hiba:', err);
            setMsg(err?.message ?? "Ismeretlen hiba történt a regisztráció során.");
        } finally {
            setLoading(false);
        }
    };



    const educationLevels = [
        "Általános iskola",
        "Középiskola",
        "Felsőoktatás",
        "Felnőtt"
    ];

    // Ország előhívószámok
    const countryCodes = [
        { code: '+36', country: '🇭🇺 Magyarország', flag: '🇭🇺' },
        { code: '+43', country: '🇦🇹 Ausztria', flag: '🇦🇹' },
        { code: '+420', country: '🇨🇿 Csehország', flag: '🇨🇿' },
        { code: '+421', country: '🇸🇰 Szlovákia', flag: '🇸🇰' },
        { code: '+48', country: '🇵🇱 Lengyelország', flag: '🇵🇱' },
        { code: '+49', country: '🇩🇪 Németország', flag: '🇩🇪' },
        { code: '+33', country: '🇫🇷 Franciaország', flag: '🇫🇷' },
        { code: '+39', country: '🇮🇹 Olaszország', flag: '🇮🇹' },
        { code: '+34', country: '🇪🇸 Spanyolország', flag: '🇪🇸' },
        { code: '+31', country: '🇳🇱 Hollandia', flag: '🇳🇱' },
        { code: '+44', country: '🇬🇧 Egyesült Királyság', flag: '🇬🇧' },
        { code: '+1', country: '🇺🇸 USA/Kanada', flag: '🇺🇸' },
        { code: '+7', country: '🇷🇺 Oroszország', flag: '🇷🇺' },
        { code: '+86', country: '🇨🇳 Kína', flag: '🇨🇳' },
        { code: '+81', country: '🇯🇵 Japán', flag: '🇯🇵' },
        { code: '+82', country: '🇰🇷 Dél-Korea', flag: '🇰🇷' },
        { code: '+91', country: '🇮🇳 India', flag: '🇮🇳' },
        { code: '+55', country: '🇧🇷 Brazília', flag: '🇧🇷' },
        { code: '+52', country: '🇲🇽 Mexikó', flag: '🇲🇽' },
        { code: '+54', country: '🇦🇷 Argentína', flag: '🇦🇷' },
        { code: '+61', country: '🇦🇺 Ausztrália', flag: '🇦🇺' },
        { code: '+27', country: '🇿🇦 Dél-Afrika', flag: '🇿🇦' },
        { code: '+20', country: '🇪🇬 Egyiptom', flag: '🇪🇬' },
        { code: '+971', country: '🇦🇪 UAE', flag: '🇦🇪' },
        { code: '+966', country: '🇸🇦 Szaúd-Arábia', flag: '🇸🇦' },
        { code: '+90', country: '🇹🇷 Törökország', flag: '🇹🇷' },
        { code: '+380', country: '🇺🇦 Ukrajna', flag: '🇺🇦' },
        { code: '+40', country: '🇷🇴 Románia', flag: '🇷🇴' },
        { code: '+359', country: '🇧🇬 Bulgária', flag: '🇧🇬' },
        { code: '+385', country: '🇭🇷 Horvátország', flag: '🇭🇷' },
        { code: '+386', country: '🇸🇮 Szlovénia', flag: '🇸🇮' },
        { code: '+371', country: '🇱🇻 Lettország', flag: '🇱🇻' },
        { code: '+372', country: '🇪🇪 Észtország', flag: '🇪🇪' },
        { code: '+370', country: '🇱🇹 Litvánia', flag: '🇱🇹' }
    ];

    // Jelszó erősség ellenőrző függvény
    const checkPasswordStrength = (password: string) => {
        let score = 0;
        let feedback = '';

        // Hossz ellenőrzése
        if (password.length >= 8) score += 1;
        if (password.length >= 12) score += 1;
        if (password.length >= 16) score += 1;

        // Kisbetűk
        if (/[a-z]/.test(password)) score += 1;

        // Nagybetűk
        if (/[A-Z]/.test(password)) score += 1;

        // Számok
        if (/[0-9]/.test(password)) score += 1;

        // Speciális karakterek
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;

        // Vegyes karakterek (nem csak betűk vagy számok)
        if (/^(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)) score += 1;

        // Erősség szint meghatározása
        if (score <= 2) {
            feedback = 'Gyenge jelszó';
        } else if (score <= 4) {
            feedback = 'Közepes jelszó';
        } else if (score <= 6) {
            feedback = 'Erős jelszó';
        } else {
            feedback = 'Nagyon erős jelszó';
        }

        return { score: Math.min(score, 7), feedback };
    };



    // Telefonszám validáció függvény
    const validatePhoneNumber = (countryCode: string, phoneNumber: string) => {
        const fullNumber = countryCode + phoneNumber;

        // Alapvető ellenőrzések
        if (!phoneNumber || phoneNumber.length < 6) {
            return { isValid: false, message: 'A telefonszám túl rövid!' };
        }

        if (phoneNumber.length > 15) {
            return { isValid: false, message: 'A telefonszám túl hosszú!' };
        }

        // Csak számok és néhány speciális karakter
        if (!/^[\d\s\-\(\)\+]+$/.test(phoneNumber)) {
            return { isValid: false, message: 'A telefonszám csak számokat és speciális karaktereket tartalmazhat!' };
        }

        // Magyar telefonszám specifikus ellenőrzés
        if (countryCode === '+36') {
            // Magyar mobil számok: 20, 30, 50, 60, 70
            const mobilePrefixes = ['20', '30', '50', '60', '70'];
            const cleanNumber = phoneNumber.replace(/\s/g, '');

            if (cleanNumber.length === 9) {
                const prefix = cleanNumber.substring(0, 2);
                if (mobilePrefixes.includes(prefix)) {
                    return { isValid: true, message: 'Érvényes magyar mobil szám' };
                }
            }

            // Magyar vezetékes számok: 1, 2, 3, 4, 5, 6, 7, 8, 9
            if (cleanNumber.length >= 8 && cleanNumber.length <= 9) {
                const firstDigit = cleanNumber.charAt(0);
                if (/^[1-9]$/.test(firstDigit)) {
                    return { isValid: true, message: 'Érvényes magyar vezetékes szám' };
                }
            }

            return { isValid: false, message: 'Érvénytelen magyar telefonszám formátum!' };
        }

        // Általános ellenőrzés más országokra
        const cleanNumber = phoneNumber.replace(/\s/g, '');
        if (cleanNumber.length >= 6 && cleanNumber.length <= 15) {
            return { isValid: true, message: 'Érvényes telefonszám' };
        }

        return { isValid: false, message: 'Érvénytelen telefonszám formátum!' };
    };

    return (
        <>
            <Head>
                <title>Diák fiók – Regisztráció</title>
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

                {/* EmailJS removed - using dashboard notifications only */}
            </Head>

            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
                fontFamily: 'Montserrat, sans-serif',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Mathematical symbols - many more */}
                <div style={{
                    position: 'absolute',
                    top: '10%',
                    left: '10%',
                    fontSize: '24px',
                    color: '#39FF14',
                    opacity: 0.6,
                    animation: 'float 8s ease-in-out infinite'
                }}>∑</div>

                <div style={{
                    position: 'absolute',
                    top: '20%',
                    right: '15%',
                    fontSize: '20px',
                    color: '#FF49DB',
                    opacity: 0.5,
                    animation: 'float 10s ease-in-out infinite'
                }}>π</div>

                <div style={{
                    position: 'absolute',
                    bottom: '20%',
                    left: '20%',
                    fontSize: '28px',
                    color: '#39FF14',
                    opacity: 0.4,
                    animation: 'float 12s ease-in-out infinite'
                }}>∞</div>

                <div style={{
                    position: 'absolute',
                    bottom: '30%',
                    right: '10%',
                    fontSize: '22px',
                    color: '#FF49DB',
                    opacity: 0.6,
                    animation: 'float 9s ease-in-out infinite'
                }}>∫</div>

                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '5%',
                    fontSize: '18px',
                    color: '#39FF14',
                    opacity: 0.3,
                    animation: 'float 11s ease-in-out infinite'
                }}>√</div>

                <div style={{
                    position: 'absolute',
                    top: '60%',
                    right: '5%',
                    fontSize: '26px',
                    color: '#FF49DB',
                    opacity: 0.4,
                    animation: 'float 7s ease-in-out infinite'
                }}>Δ</div>

                <div style={{
                    position: 'absolute',
                    top: '5%',
                    left: '50%',
                    fontSize: '16px',
                    color: '#39FF14',
                    opacity: 0.5,
                    animation: 'float 13s ease-in-out infinite'
                }}>θ</div>

                <div style={{
                    position: 'absolute',
                    top: '70%',
                    left: '15%',
                    fontSize: '30px',
                    color: '#FF49DB',
                    opacity: 0.4,
                    animation: 'float 6s ease-in-out infinite'
                }}>φ</div>

                <div style={{
                    position: 'absolute',
                    top: '40%',
                    right: '25%',
                    fontSize: '14px',
                    color: '#39FF14',
                    opacity: 0.7,
                    animation: 'float 15s ease-in-out infinite'
                }}>λ</div>

                <div style={{
                    position: 'absolute',
                    bottom: '10%',
                    left: '35%',
                    fontSize: '32px',
                    color: '#FF49DB',
                    opacity: 0.3,
                    animation: 'float 8s ease-in-out infinite'
                }}>Ω</div>

                <div style={{
                    position: 'absolute',
                    top: '80%',
                    right: '35%',
                    fontSize: '20px',
                    color: '#39FF14',
                    opacity: 0.6,
                    animation: 'float 11s ease-in-out infinite'
                }}>∇</div>

                <div style={{
                    position: 'absolute',
                    top: '85%',
                    right: '15%',
                    fontSize: '18px',
                    color: '#FF49DB',
                    opacity: 0.5,
                    animation: 'float 9s ease-in-out infinite'
                }}>∂</div>

                <div style={{
                    position: 'absolute',
                    top: '55%',
                    left: '30%',
                    fontSize: '24px',
                    color: '#39FF14',
                    opacity: 0.4,
                    animation: 'float 14s ease-in-out infinite'
                }}>∏</div>

                <div style={{
                    position: 'absolute',
                    bottom: '25%',
                    left: '45%',
                    fontSize: '22px',
                    color: '#FF49DB',
                    opacity: 0.6,
                    animation: 'float 10s ease-in-out infinite'
                }}>Γ</div>

                {/* Many more mathematical symbols */}
                <div style={{
                    position: 'absolute',
                    top: '15%',
                    left: '25%',
                    fontSize: '19px',
                    color: '#39FF14',
                    opacity: 0.5,
                    animation: 'float 16s ease-in-out infinite'
                }}>α</div>

                <div style={{
                    position: 'absolute',
                    top: '25%',
                    left: '35%',
                    fontSize: '21px',
                    color: '#FF49DB',
                    opacity: 0.4,
                    animation: 'float 17s ease-in-out infinite'
                }}>β</div>

                <div style={{
                    position: 'absolute',
                    top: '35%',
                    left: '45%',
                    fontSize: '23px',
                    color: '#39FF14',
                    opacity: 0.6,
                    animation: 'float 18s ease-in-out infinite'
                }}>γ</div>

                <div style={{
                    position: 'absolute',
                    top: '45%',
                    left: '55%',
                    fontSize: '17px',
                    color: '#FF49DB',
                    opacity: 0.3,
                    animation: 'float 19s ease-in-out infinite'
                }}>δ</div>

                <div style={{
                    position: 'absolute',
                    top: '55%',
                    left: '65%',
                    fontSize: '25px',
                    color: '#39FF14',
                    opacity: 0.5,
                    animation: 'float 20s ease-in-out infinite'
                }}>ε</div>

                <div style={{
                    position: 'absolute',
                    top: '65%',
                    left: '75%',
                    fontSize: '15px',
                    color: '#FF49DB',
                    opacity: 0.7,
                    animation: 'float 21s ease-in-out infinite'
                }}>ζ</div>

                <div style={{
                    position: 'absolute',
                    top: '75%',
                    left: '85%',
                    fontSize: '27px',
                    color: '#39FF14',
                    opacity: 0.4,
                    animation: 'float 22s ease-in-out infinite'
                }}>η</div>

                <div style={{
                    position: 'absolute',
                    top: '85%',
                    left: '95%',
                    fontSize: '13px',
                    color: '#FF49DB',
                    opacity: 0.6,
                    animation: 'float 23s ease-in-out infinite'
                }}>ι</div>

                <div style={{
                    position: 'absolute',
                    top: '95%',
                    left: '5%',
                    fontSize: '29px',
                    color: '#39FF14',
                    opacity: 0.3,
                    animation: 'float 24s ease-in-out infinite'
                }}>κ</div>

                <div style={{
                    position: 'absolute',
                    top: '5%',
                    left: '15%',
                    fontSize: '31px',
                    color: '#FF49DB',
                    opacity: 0.5,
                    animation: 'float 25s ease-in-out infinite'
                }}>μ</div>

                <div style={{
                    position: 'absolute',
                    top: '15%',
                    left: '25%',
                    fontSize: '33px',
                    color: '#39FF14',
                    opacity: 0.4,
                    animation: 'float 26s ease-in-out infinite'
                }}>ν</div>

                <div style={{
                    position: 'absolute',
                    top: '25%',
                    left: '35%',
                    fontSize: '35px',
                    color: '#FF49DB',
                    opacity: 0.6,
                    animation: 'float 27s ease-in-out infinite'
                }}>ξ</div>

                <div style={{
                    position: 'absolute',
                    top: '35%',
                    left: '45%',
                    fontSize: '37px',
                    color: '#39FF14',
                    opacity: 0.3,
                    animation: 'float 28s ease-in-out infinite'
                }}>ο</div>

                <div style={{
                    position: 'absolute',
                    top: '45%',
                    left: '55%',
                    fontSize: '39px',
                    color: '#FF49DB',
                    opacity: 0.5,
                    animation: 'float 29s ease-in-out infinite'
                }}>ρ</div>

                <div style={{
                    position: 'absolute',
                    top: '55%',
                    left: '65%',
                    fontSize: '41px',
                    color: '#39FF14',
                    opacity: 0.4,
                    animation: 'float 30s ease-in-out infinite'
                }}>σ</div>

                <div style={{
                    position: 'absolute',
                    top: '65%',
                    left: '75%',
                    fontSize: '43px',
                    color: '#FF49DB',
                    opacity: 0.7,
                    animation: 'float 31s ease-in-out infinite'
                }}>τ</div>

                <div style={{
                    position: 'absolute',
                    top: '75%',
                    left: '85%',
                    fontSize: '45px',
                    color: '#39FF14',
                    opacity: 0.3,
                    animation: 'float 32s ease-in-out infinite'
                }}>υ</div>

                <div style={{
                    position: 'absolute',
                    top: '85%',
                    left: '95%',
                    fontSize: '47px',
                    color: '#FF49DB',
                    opacity: 0.6,
                    animation: 'float 33s ease-in-out infinite'
                }}>χ</div>

                <div style={{
                    position: 'absolute',
                    top: '95%',
                    left: '5%',
                    fontSize: '49px',
                    color: '#39FF14',
                    opacity: 0.4,
                    animation: 'float 34s ease-in-out infinite'
                }}>ψ</div>

                <div style={{
                    position: 'absolute',
                    top: '5%',
                    left: '15%',
                    fontSize: '51px',
                    color: '#FF49DB',
                    opacity: 0.5,
                    animation: 'float 35s ease-in-out infinite'
                }}>ω</div>

                <div style={{
                    position: 'absolute',
                    top: '15%',
                    left: '25%',
                    fontSize: '53px',
                    color: '#39FF14',
                    opacity: 0.3,
                    animation: 'float 36s ease-in-out infinite'
                }}>∈</div>

                <div style={{
                    position: 'absolute',
                    top: '25%',
                    left: '35%',
                    fontSize: '55px',
                    color: '#FF49DB',
                    opacity: 0.6,
                    animation: 'float 37s ease-in-out infinite'
                }}>∉</div>

                <div style={{
                    position: 'absolute',
                    top: '35%',
                    left: '45%',
                    fontSize: '57px',
                    color: '#39FF14',
                    opacity: 0.4,
                    animation: 'float 38s ease-in-out infinite'
                }}>⊂</div>

                <div style={{
                    position: 'absolute',
                    top: '45%',
                    left: '55%',
                    fontSize: '59px',
                    color: '#FF49DB',
                    opacity: 0.5,
                    animation: 'float 39s ease-in-out infinite'
                }}>⊃</div>

                <div style={{
                    position: 'absolute',
                    top: '55%',
                    left: '65%',
                    fontSize: '61px',
                    color: '#39FF14',
                    opacity: 0.3,
                    animation: 'float 40s ease-in-out infinite'
                }}>∪</div>

                <div style={{
                    position: 'absolute',
                    top: '65%',
                    left: '75%',
                    fontSize: '63px',
                    color: '#FF49DB',
                    opacity: 0.7,
                    animation: 'float 41s ease-in-out infinite'
                }}>∩</div>

                <div style={{
                    position: 'absolute',
                    top: '75%',
                    left: '85%',
                    fontSize: '65px',
                    color: '#39FF14',
                    opacity: 0.4,
                    animation: 'float 42s ease-in-out infinite'
                }}>⊆</div>

                <div style={{
                    position: 'absolute',
                    top: '85%',
                    left: '95%',
                    fontSize: '67px',
                    color: '#FF49DB',
                    opacity: 0.6,
                    animation: 'float 43s ease-in-out infinite'
                }}>⊇</div>

                <div style={{
                    position: 'absolute',
                    top: '95%',
                    left: '5%',
                    fontSize: '69px',
                    color: '#39FF14',
                    opacity: 0.3,
                    animation: 'float 44s ease-in-out infinite'
                }}>≠</div>

                <div style={{
                    position: 'absolute',
                    top: '5%',
                    left: '15%',
                    fontSize: '71px',
                    color: '#FF49DB',
                    opacity: 0.5,
                    animation: 'float 45s ease-in-out infinite'
                }}>≤</div>

                <div style={{
                    position: 'absolute',
                    top: '15%',
                    left: '25%',
                    fontSize: '73px',
                    color: '#39FF14',
                    opacity: 0.4,
                    animation: 'float 46s ease-in-out infinite'
                }}>≥</div>

                <div style={{
                    position: 'absolute',
                    top: '25%',
                    left: '35%',
                    fontSize: '75px',
                    color: '#FF49DB',
                    opacity: 0.6,
                    animation: 'float 47s ease-in-out infinite'
                }}>±</div>

                <div style={{
                    position: 'absolute',
                    top: '35%',
                    left: '45%',
                    fontSize: '77px',
                    color: '#39FF14',
                    opacity: 0.3,
                    animation: 'float 48s ease-in-out infinite'
                }}>×</div>

                <div style={{
                    position: 'absolute',
                    top: '45%',
                    left: '55%',
                    fontSize: '79px',
                    color: '#FF49DB',
                    opacity: 0.5,
                    animation: 'float 49s ease-in-out infinite'
                }}>÷</div>

                <div style={{
                    position: 'absolute',
                    top: '55%',
                    left: '65%',
                    fontSize: '81px',
                    color: '#39FF14',
                    opacity: 0.4,
                    animation: 'float 50s ease-in-out infinite'
                }}>⋅</div>

                <div style={{
                    position: 'absolute',
                    top: '65%',
                    left: '75%',
                    fontSize: '83px',
                    color: '#FF49DB',
                    opacity: 0.7,
                    animation: 'float 51s ease-in-out infinite'
                }}>∘</div>

                <div style={{
                    position: 'absolute',
                    top: '75%',
                    left: '85%',
                    fontSize: '85px',
                    color: '#39FF14',
                    opacity: 0.3,
                    animation: 'float 52s ease-in-out infinite'
                }}>⊗</div>

                <div style={{
                    position: 'absolute',
                    top: '85%',
                    left: '95%',
                    fontSize: '87px',
                    color: '#FF49DB',
                    opacity: 0.6,
                    animation: 'float 53s ease-in-out infinite'
                }}>⊕</div>

                <div style={{
                    position: 'absolute',
                    top: '95%',
                    left: '5%',
                    fontSize: '89px',
                    color: '#39FF14',
                    opacity: 0.4,
                    animation: 'float 54s ease-in-out infinite'
                }}>⊥</div>

                <div style={{
                    position: 'absolute',
                    top: '5%',
                    left: '15%',
                    fontSize: '91px',
                    color: '#FF49DB',
                    opacity: 0.5,
                    animation: 'float 55s ease-in-out infinite'
                }}>∥</div>

                <div style={{
                    position: 'absolute',
                    top: '15%',
                    left: '25%',
                    fontSize: '93px',
                    color: '#39FF14',
                    opacity: 0.3,
                    animation: 'float 56s ease-in-out infinite'
                }}>∠</div>

                <div style={{
                    position: 'absolute',
                    top: '25%',
                    left: '35%',
                    fontSize: '95px',
                    color: '#FF49DB',
                    opacity: 0.6,
                    animation: 'float 57s ease-in-out infinite'
                }}>∡</div>

                <div style={{
                    position: 'absolute',
                    top: '35%',
                    left: '45%',
                    fontSize: '97px',
                    color: '#39FF14',
                    opacity: 0.4,
                    animation: 'float 58s ease-in-out infinite'
                }}>∢</div>

                <div style={{
                    position: 'absolute',
                    top: '45%',
                    left: '55%',
                    fontSize: '99px',
                    color: '#FF49DB',
                    opacity: 0.5,
                    animation: 'float 59s ease-in-out infinite'
                }}>⊤</div>

                <div style={{
                    position: 'absolute',
                    top: '55%',
                    left: '65%',
                    fontSize: '101px',
                    color: '#39FF14',
                    opacity: 0.3,
                    animation: 'float 60s ease-in-out infinite'
                }}>⊥</div>

                {/* Many more symbols for faster movement */}
                <div style={{
                    position: 'absolute',
                    top: '10%',
                    left: '20%',
                    fontSize: '12px',
                    color: '#FF49DB',
                    opacity: 0.8,
                    animation: 'bounce 3s ease-in-out infinite'
                }}>1</div>

                <div style={{
                    position: 'absolute',
                    top: '20%',
                    left: '30%',
                    fontSize: '14px',
                    color: '#39FF14',
                    opacity: 0.7,
                    animation: 'float 4s ease-in-out infinite'
                }}>2</div>

                <div style={{
                    position: 'absolute',
                    top: '30%',
                    left: '40%',
                    fontSize: '16px',
                    color: '#FF49DB',
                    opacity: 0.6,
                    animation: 'bounce 5s ease-in-out infinite'
                }}>3</div>

                <div style={{
                    position: 'absolute',
                    top: '40%',
                    left: '50%',
                    fontSize: '18px',
                    color: '#39FF14',
                    opacity: 0.8,
                    animation: 'float 6s ease-in-out infinite'
                }}>4</div>

                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '60%',
                    fontSize: '20px',
                    color: '#FF49DB',
                    opacity: 0.5,
                    animation: 'bounce 7s ease-in-out infinite'
                }}>5</div>

                <div style={{
                    position: 'absolute',
                    top: '60%',
                    left: '70%',
                    fontSize: '22px',
                    color: '#39FF14',
                    opacity: 0.7,
                    animation: 'float 8s ease-in-out infinite'
                }}>6</div>

                <div style={{
                    position: 'absolute',
                    top: '70%',
                    left: '80%',
                    fontSize: '24px',
                    color: '#FF49DB',
                    opacity: 0.6,
                    animation: 'bounce 9s ease-in-out infinite'
                }}>7</div>

                <div style={{
                    position: 'absolute',
                    top: '80%',
                    left: '90%',
                    fontSize: '26px',
                    color: '#39FF14',
                    opacity: 0.8,
                    animation: 'float 10s ease-in-out infinite'
                }}>8</div>

                <div style={{
                    position: 'absolute',
                    top: '90%',
                    left: '10%',
                    fontSize: '28px',
                    color: '#FF49DB',
                    opacity: 0.5,
                    animation: 'bounce 11s ease-in-out infinite'
                }}>9</div>

                <div style={{
                    position: 'absolute',
                    top: '5%',
                    left: '25%',
                    fontSize: '30px',
                    color: '#39FF14',
                    opacity: 0.7,
                    animation: 'float 12s ease-in-out infinite'
                }}>0</div>

                <div style={{
                    position: 'absolute',
                    top: '15%',
                    left: '35%',
                    fontSize: '32px',
                    color: '#FF49DB',
                    opacity: 0.6,
                    animation: 'bounce 13s ease-in-out infinite'
                }}>+</div>

                <div style={{
                    position: 'absolute',
                    top: '25%',
                    left: '45%',
                    fontSize: '34px',
                    color: '#39FF14',
                    opacity: 0.8,
                    animation: 'float 14s ease-in-out infinite'
                }}>-</div>

                <div style={{
                    position: 'absolute',
                    top: '35%',
                    left: '55%',
                    fontSize: '36px',
                    color: '#FF49DB',
                    opacity: 0.5,
                    animation: 'bounce 15s ease-in-out infinite'
                }}>=</div>

                <div style={{
                    position: 'absolute',
                    top: '45%',
                    left: '65%',
                    fontSize: '38px',
                    color: '#39FF14',
                    opacity: 0.7,
                    animation: 'float 16s ease-in-out infinite'
                }}>≈</div>

                <div style={{
                    position: 'absolute',
                    top: '55%',
                    left: '75%',
                    fontSize: '40px',
                    color: '#FF49DB',
                    opacity: 0.6,
                    animation: 'bounce 17s ease-in-out infinite'
                }}>≡</div>

                <div style={{
                    position: 'absolute',
                    top: '65%',
                    left: '85%',
                    fontSize: '42px',
                    color: '#39FF14',
                    opacity: 0.8,
                    animation: 'float 18s ease-in-out infinite'
                }}>≅</div>

                <div style={{
                    position: 'absolute',
                    top: '75%',
                    left: '95%',
                    fontSize: '44px',
                    color: '#FF49DB',
                    opacity: 0.5,
                    animation: 'bounce 19s ease-in-out infinite'
                }}>∝</div>

                <div style={{
                    position: 'absolute',
                    top: '85%',
                    left: '5%',
                    fontSize: '46px',
                    color: '#39FF14',
                    opacity: 0.7,
                    animation: 'float 20s ease-in-out infinite'
                }}>∞</div>

                <div style={{
                    position: 'absolute',
                    top: '95%',
                    left: '15%',
                    fontSize: '48px',
                    color: '#FF49DB',
                    opacity: 0.6,
                    animation: 'bounce 21s ease-in-out infinite'
                }}>∅</div>

                <div style={{
                    position: 'absolute',
                    top: '5%',
                    left: '25%',
                    fontSize: '50px',
                    color: '#39FF14',
                    opacity: 0.8,
                    animation: 'float 22s ease-in-out infinite'
                }}>ℕ</div>

                <div style={{
                    position: 'absolute',
                    top: '15%',
                    left: '35%',
                    fontSize: '52px',
                    color: '#FF49DB',
                    opacity: 0.5,
                    animation: 'bounce 23s ease-in-out infinite'
                }}>ℤ</div>

                <div style={{
                    position: 'absolute',
                    top: '25%',
                    left: '45%',
                    fontSize: '54px',
                    color: '#39FF14',
                    opacity: 0.7,
                    animation: 'float 24s ease-in-out infinite'
                }}>ℚ</div>

                <div style={{
                    position: 'absolute',
                    top: '35%',
                    left: '55%',
                    fontSize: '56px',
                    color: '#FF49DB',
                    opacity: 0.6,
                    animation: 'bounce 25s ease-in-out infinite'
                }}>ℝ</div>

                <div style={{
                    position: 'absolute',
                    top: '45%',
                    left: '65%',
                    fontSize: '58px',
                    color: '#39FF14',
                    opacity: 0.8,
                    animation: 'float 26s ease-in-out infinite'
                }}>ℂ</div>

                <div style={{
                    position: 'absolute',
                    top: '55%',
                    left: '75%',
                    fontSize: '60px',
                    color: '#FF49DB',
                    opacity: 0.5,
                    animation: 'bounce 27s ease-in-out infinite'
                }}>ℙ</div>

                <div style={{
                    position: 'absolute',
                    top: '65%',
                    left: '85%',
                    fontSize: '62px',
                    color: '#39FF14',
                    opacity: 0.7,
                    animation: 'float 28s ease-in-out infinite'
                }}>ℍ</div>

                <div style={{
                    position: 'absolute',
                    top: '75%',
                    left: '95%',
                    fontSize: '64px',
                    color: '#FF49DB',
                    opacity: 0.6,
                    animation: 'bounce 29s ease-in-out infinite'
                }}>ℵ</div>

                <div style={{
                    position: 'absolute',
                    top: '85%',
                    left: '5%',
                    fontSize: '66px',
                    color: '#39FF14',
                    opacity: 0.8,
                    animation: 'float 30s ease-in-out infinite'
                }}>ℶ</div>

                <div style={{
                    position: 'absolute',
                    top: '95%',
                    left: '15%',
                    fontSize: '68px',
                    color: '#FF49DB',
                    opacity: 0.5,
                    animation: 'bounce 31s ease-in-out infinite'
                }}>ℷ</div>

                <div style={{
                    position: 'absolute',
                    top: '5%',
                    left: '25%',
                    fontSize: '70px',
                    color: '#39FF14',
                    opacity: 0.7,
                    animation: 'float 32s ease-in-out infinite'
                }}>ℸ</div>

                <div style={{
                    position: 'absolute',
                    top: '15%',
                    left: '35%',
                    fontSize: '72px',
                    color: '#FF49DB',
                    opacity: 0.6,
                    animation: 'bounce 33s ease-in-out infinite'
                }}>ℹ</div>

                <div style={{
                    position: 'absolute',
                    top: '25%',
                    left: '45%',
                    fontSize: '74px',
                    color: '#39FF14',
                    opacity: 0.8,
                    animation: 'float 34s ease-in-out infinite'
                }}>℺</div>

                <div style={{
                    position: 'absolute',
                    top: '35%',
                    left: '55%',
                    fontSize: '76px',
                    color: '#FF49DB',
                    opacity: 0.5,
                    animation: 'bounce 35s ease-in-out infinite'
                }}>℻</div>

                <div style={{
                    position: 'absolute',
                    top: '45%',
                    left: '65%',
                    fontSize: '78px',
                    color: '#39FF14',
                    opacity: 0.7,
                    animation: 'float 36s ease-in-out infinite'
                }}>ℼ</div>

                <div style={{
                    position: 'absolute',
                    top: '55%',
                    left: '75%',
                    fontSize: '80px',
                    color: '#FF49DB',
                    opacity: 0.6,
                    animation: 'bounce 37s ease-in-out infinite'
                }}>ℽ</div>

                <div style={{
                    position: 'absolute',
                    top: '65%',
                    left: '85%',
                    fontSize: '82px',
                    color: '#39FF14',
                    opacity: 0.8,
                    animation: 'float 38s ease-in-out infinite'
                }}>ℾ</div>

                <div style={{
                    position: 'absolute',
                    top: '75%',
                    left: '95%',
                    fontSize: '84px',
                    color: '#FF49DB',
                    opacity: 0.5,
                    animation: 'bounce 39s ease-in-out infinite'
                }}>ℿ</div>

                <div style={{
                    position: 'absolute',
                    top: '85%',
                    left: '5%',
                    fontSize: '86px',
                    color: '#39FF14',
                    opacity: 0.7,
                    animation: 'float 40s ease-in-out infinite'
                }}>⅀</div>

                <div style={{
                    position: 'absolute',
                    top: '95%',
                    left: '15%',
                    fontSize: '88px',
                    color: '#FF49DB',
                    opacity: 0.6,
                    animation: 'bounce 41s ease-in-out infinite'
                }}>⅁</div>

                <div style={{
                    position: 'absolute',
                    top: '5%',
                    left: '25%',
                    fontSize: '90px',
                    color: '#39FF14',
                    opacity: 0.8,
                    animation: 'float 42s ease-in-out infinite'
                }}>⅂</div>

                <div style={{
                    position: 'absolute',
                    top: '15%',
                    left: '35%',
                    fontSize: '92px',
                    color: '#FF49DB',
                    opacity: 0.5,
                    animation: 'bounce 43s ease-in-out infinite'
                }}>⅃</div>

                <div style={{
                    position: 'absolute',
                    top: '25%',
                    left: '45%',
                    fontSize: '94px',
                    color: '#39FF14',
                    opacity: 0.7,
                    animation: 'float 44s ease-in-out infinite'
                }}>⅄</div>

                <div style={{
                    position: 'absolute',
                    top: '35%',
                    left: '55%',
                    fontSize: '96px',
                    color: '#FF49DB',
                    opacity: 0.6,
                    animation: 'bounce 45s ease-in-out infinite'
                }}>ⅅ</div>

                <div style={{
                    position: 'absolute',
                    top: '45%',
                    left: '65%',
                    fontSize: '98px',
                    color: '#39FF14',
                    opacity: 0.8,
                    animation: 'float 46s ease-in-out infinite'
                }}>ⅆ</div>

                <div style={{
                    position: 'absolute',
                    top: '55%',
                    left: '75%',
                    fontSize: '100px',
                    color: '#FF49DB',
                    opacity: 0.5,
                    animation: 'bounce 47s ease-in-out infinite'
                }}>ⅇ</div>

                <div style={{
                    position: 'absolute',
                    top: '65%',
                    left: '85%',
                    fontSize: '102px',
                    color: '#39FF14',
                    opacity: 0.7,
                    animation: 'float 48s ease-in-out infinite'
                }}>ⅈ</div>

                <div style={{
                    position: 'absolute',
                    top: '75%',
                    left: '95%',
                    fontSize: '104px',
                    color: '#FF49DB',
                    opacity: 0.6,
                    animation: 'bounce 49s ease-in-out infinite'
                }}>ⅉ</div>

                {/* Moving lines/particles */}
                <div style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, #39FF14, transparent)',
                    opacity: 0.3,
                    animation: 'moveHorizontal 20s linear infinite'
                }}></div>

                <div style={{
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    width: '2px',
                    height: '100%',
                    background: 'linear-gradient(180deg, transparent, #FF49DB, transparent)',
                    opacity: 0.3,
                    animation: 'moveVertical 25s linear infinite'
                }}></div>

                <div style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    width: '100%',
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, #39FF14, transparent)',
                    opacity: 0.2,
                    animation: 'moveHorizontal 18s linear infinite reverse'
                }}></div>

                <div style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '2px',
                    height: '100%',
                    background: 'linear-gradient(180deg, transparent, #FF49DB, transparent)',
                    opacity: 0.2,
                    animation: 'moveVertical 22s linear infinite reverse'
                }}></div>
                <div style={{
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '20px',
                    padding: '40px',
                    width: '100%',
                    maxWidth: '500px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Gradient border effect */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: 'linear-gradient(90deg, #39FF14, #FF49DB)',
                        animation: 'shimmer 3s ease-in-out infinite'
                    }}></div>

                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <div style={{
                            width: '120px',
                            height: '120px',
                            background: 'linear-gradient(45deg, #39FF14, #FF49DB)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px',
                            overflow: 'hidden',
                            border: '3px solid rgba(255,255,255,0.2)',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                            position: 'relative',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                            onClick={() => {
                                const input = document.getElementById('profile-upload') as HTMLInputElement;
                                if (input) {
                                    input.click();
                                }
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                                e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,0,0,0.4)';
                                const cameraIcon = e.currentTarget.querySelector('.camera-icon') as HTMLElement;
                                if (cameraIcon) {
                                    cameraIcon.style.opacity = '1';
                                    cameraIcon.style.transform = 'translateY(0)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
                                const cameraIcon = e.currentTarget.querySelector('.camera-icon') as HTMLElement;
                                if (cameraIcon) {
                                    cameraIcon.style.opacity = '0';
                                    cameraIcon.style.transform = 'translateY(5px)';
                                }
                            }}
                        >
                            {profileImagePreview ? (
                                <>
                                    {console.log('Rendering profile image:', profileImagePreview.substring(0, 50) + '...')}
                                    <img
                                        src={profileImagePreview}
                                        alt="Profilkép"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            borderRadius: '50%'
                                        }}
                                    />
                                </>
                            ) : (
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '32px',
                                    fontWeight: 'bold',
                                    color: '#000'
                                }}>
                                    👤
                                </div>
                            )}
                            <div
                                className="camera-icon"
                                style={{
                                    position: 'absolute',
                                    bottom: '0',
                                    right: '0',
                                    background: 'rgba(0,0,0,0.8)',
                                    color: 'white',
                                    fontSize: '16px',
                                    padding: '4px 8px',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    opacity: '0',
                                    transition: 'all 0.3s ease',
                                    transform: 'translateY(5px)'
                                }}
                            >
                                📷
                            </div>
                        </div>
                        <input
                            id="profile-upload"
                            type="file"
                            accept="image/*"
                            style={{
                                display: 'none'
                            }}

                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setProfileImage(file);
                                    const reader = new FileReader();
                                    reader.onload = (e) => {
                                        const imageUrl = e.target?.result as string;
                                        setOriginalImage(imageUrl);
                                        setShowCropper(true);
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                        />
                        <p style={{
                            margin: '0 0 20px 0',
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: '12px',
                            textAlign: 'center'
                        }}>
                            Kattints a képre a profilfénykép feltöltéséhez
                        </p>


                        <h2 style={{
                            margin: 0,
                            fontSize: '28px',
                            color: '#39FF14',
                            fontWeight: '600'
                        }}>Regisztráció</h2>
                        <p style={{
                            margin: '10px 0 0 0',
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: '14px'
                        }}>Hozz létre egy új fiókot</p>
                    </div>

                    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="text"
                                placeholder="Vezetéknév *"
                                required
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                disabled={loading}
                                style={{
                                    flex: 1,
                                    padding: '12px 10px',
                                    borderRadius: '12px',
                                    border: '2px solid rgba(255,255,255,0.1)',
                                    background: 'rgba(0,0,0,0.3)',
                                    color: '#39FF14',
                                    fontSize: '14px',
                                    transition: 'all 0.3s ease'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#39FF14';
                                    e.target.style.boxShadow = '0 0 20px rgba(57, 255, 20, 0.3)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                            <input
                                type="text"
                                placeholder="Keresztnév *"
                                required
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                disabled={loading}
                                style={{
                                    flex: 1,
                                    padding: '12px 10px',
                                    borderRadius: '12px',
                                    border: '2px solid rgba(255,255,255,0.1)',
                                    background: 'rgba(0,0,0,0.3)',
                                    color: '#39FF14',
                                    fontSize: '14px',
                                    transition: 'all 0.3s ease'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#39FF14';
                                    e.target.style.boxShadow = '0 0 20px rgba(57, 255, 20, 0.3)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>

                        <div>
                            <input
                                type="email"
                                placeholder="Email cím *"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '15px',
                                    borderRadius: '12px',
                                    border: '2px solid rgba(255,255,255,0.1)',
                                    background: 'rgba(0,0,0,0.3)',
                                    color: '#39FF14',
                                    fontSize: '16px',
                                    transition: 'all 0.3s ease'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#39FF14';
                                    e.target.style.boxShadow = '0 0 20px rgba(57, 255, 20, 0.3)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>

                        <div>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Jelszó *"
                                    required
                                    value={password}
                                    onChange={(e) => {
                                        setPass(e.target.value);
                                        setPasswordStrength(checkPasswordStrength(e.target.value));
                                    }}
                                    disabled={loading}
                                    style={{
                                        width: '100%',
                                        padding: '15px 50px 15px 15px',
                                        borderRadius: '12px',
                                        border: '2px solid rgba(255,255,255,0.1)',
                                        background: 'rgba(0,0,0,0.3)',
                                        color: '#39FF14',
                                        fontSize: '16px',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#39FF14';
                                        e.target.style.boxShadow = '0 0 20px rgba(57, 255, 20, 0.3)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        color: '#39FF14',
                                        fontSize: '18px',
                                        cursor: 'pointer',
                                        padding: '5px'
                                    }}
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>

                            {/* Jelszó erősség mérő */}
                            {password && (
                                <div style={{ marginTop: '10px' }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        marginBottom: '5px'
                                    }}>
                                        <div style={{
                                            flex: 1,
                                            height: '6px',
                                            background: 'rgba(255,255,255,0.1)',
                                            borderRadius: '3px',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{
                                                height: '100%',
                                                width: `${(passwordStrength.score / 7) * 100}%`,
                                                background: passwordStrength.score <= 2 ? '#ff4444' :
                                                    passwordStrength.score <= 4 ? '#ffaa00' :
                                                        passwordStrength.score <= 6 ? '#00aa00' : '#00ff00',
                                                transition: 'all 0.3s ease'
                                            }} />
                                        </div>
                                        <span style={{
                                            color: passwordStrength.score <= 2 ? '#ff4444' :
                                                passwordStrength.score <= 4 ? '#ffaa00' :
                                                    passwordStrength.score <= 6 ? '#00aa00' : '#00ff00',
                                            fontSize: '12px',
                                            fontWeight: '600'
                                        }}>
                                            {passwordStrength.feedback}
                                        </span>
                                    </div>

                                    {/* Jelszó követelmények */}
                                    <div style={{
                                        fontSize: '11px',
                                        color: 'rgba(255,255,255,0.7)',
                                        marginTop: '5px'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '10px',
                                            marginBottom: '5px'
                                        }}>
                                            <span style={{
                                                color: password.length >= 8 ? '#39FF14' : '#ff4444',
                                                fontWeight: password.length >= 8 ? '600' : '400'
                                            }}>
                                                {password.length >= 8 ? '✓' : '✗'} Legalább 8 karakter
                                            </span>
                                            <span style={{
                                                color: /[a-z]/.test(password) ? '#39FF14' : '#ff4444',
                                                fontWeight: /[a-z]/.test(password) ? '600' : '400'
                                            }}>
                                                {/[a-z]/.test(password) ? '✓' : '✗'} Kisbetű
                                            </span>
                                            <span style={{
                                                color: /[A-Z]/.test(password) ? '#39FF14' : '#ff4444',
                                                fontWeight: /[A-Z]/.test(password) ? '600' : '400'
                                            }}>
                                                {/[A-Z]/.test(password) ? '✓' : '✗'} Nagybetű
                                            </span>
                                            <span style={{
                                                color: /[0-9]/.test(password) ? '#39FF14' : '#ff4444',
                                                fontWeight: /[0-9]/.test(password) ? '600' : '400'
                                            }}>
                                                {/[0-9]/.test(password) ? '✓' : '✗'} Szám
                                            </span>
                                            <span style={{
                                                color: /[!@#$%^&*(),.?":{}|<>]/.test(password) ? '#39FF14' : '#ff4444',
                                                fontWeight: /[!@#$%^&*(),.?":{}|<>]/.test(password) ? '600' : '400'
                                            }}>
                                                {/[!@#$%^&*(),.?":{}|<>]/.test(password) ? '✓' : '✗'} Speciális karakter
                                            </span>
                                        </div>
                                        <div style={{
                                            fontSize: '10px',
                                            color: '#ffaa00',
                                            fontStyle: 'italic'
                                        }}>
                                            ⚠️ Minden követelmény kötelező a regisztrációhoz!
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {/* Országkód választó */}
                                <div style={{ position: 'relative', minWidth: '120px' }}>
                                    <select
                                        value={selectedCountryCode}
                                        onChange={(e) => setSelectedCountryCode(e.target.value)}
                                        disabled={loading}
                                        style={{
                                            width: '100%',
                                            padding: '15px 10px',
                                            borderRadius: '12px',
                                            border: '2px solid rgba(255,255,255,0.1)',
                                            background: 'rgba(0,0,0,0.3)',
                                            color: '#39FF14',
                                            fontSize: '14px',
                                            transition: 'all 0.3s ease',
                                            cursor: 'pointer'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#39FF14';
                                            e.target.style.boxShadow = '0 0 20px rgba(57, 255, 20, 0.3)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    >
                                        {countryCodes.map((country) => (
                                            <option key={country.code} value={country.code}>
                                                {country.flag} {country.code}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Telefonszám mező */}
                                <div style={{ flex: 1, position: 'relative' }}>
                                    <input
                                        type="tel"
                                        placeholder="Telefonszám *"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        disabled={loading}
                                        style={{
                                            width: '100%',
                                            padding: '15px',
                                            borderRadius: '12px',
                                            border: '2px solid rgba(255,255,255,0.1)',
                                            background: 'rgba(0,0,0,0.3)',
                                            color: '#39FF14',
                                            fontSize: '16px',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#39FF14';
                                            e.target.style.boxShadow = '0 0 20px rgba(57, 255, 20, 0.3)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Telefonszám validáció visszajelzés */}
                            {phoneNumber && (
                                <div style={{ marginTop: '10px' }}>
                                    {(() => {
                                        const validation = validatePhoneNumber(selectedCountryCode, phoneNumber);
                                        return (
                                            <div style={{
                                                fontSize: '12px',
                                                color: validation.isValid ? '#39FF14' : '#ff4444',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '5px'
                                            }}>
                                                {validation.isValid ? '✓' : '✗'} {validation.message}
                                            </div>
                                        );
                                    })()}
                                </div>
                            )}
                        </div>

                        {/* Irányítószám és város */}
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="text"
                                placeholder="Irányítószám *"
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                                disabled={loading}
                                style={{
                                    flex: 1,
                                    padding: '12px 10px',
                                    borderRadius: '12px',
                                    border: '2px solid rgba(255,255,255,0.1)',
                                    background: 'rgba(0,0,0,0.3)',
                                    color: '#39FF14',
                                    fontSize: '14px',
                                    transition: 'all 0.3s ease'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#39FF14';
                                    e.target.style.boxShadow = '0 0 20px rgba(57, 255, 20, 0.3)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                            <input
                                type="text"
                                placeholder="Város *"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                disabled={loading}
                                style={{
                                    flex: 2,
                                    padding: '12px 10px',
                                    borderRadius: '12px',
                                    border: '2px solid rgba(255,255,255,0.1)',
                                    background: 'rgba(0,0,0,0.3)',
                                    color: '#39FF14',
                                    fontSize: '14px',
                                    transition: 'all 0.3s ease'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#39FF14';
                                    e.target.style.boxShadow = '0 0 20px rgba(57, 255, 20, 0.3)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>

                        {/* Utca és házszám */}
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="text"
                                placeholder="Utca *"
                                value={street}
                                onChange={(e) => setStreet(e.target.value)}
                                disabled={loading}
                                style={{
                                    flex: 2,
                                    padding: '12px 10px',
                                    borderRadius: '12px',
                                    border: '2px solid rgba(255,255,255,0.1)',
                                    background: 'rgba(0,0,0,0.3)',
                                    color: '#39FF14',
                                    fontSize: '14px',
                                    transition: 'all 0.3s ease'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#39FF14';
                                    e.target.style.boxShadow = '0 0 20px rgba(57, 255, 20, 0.3)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                            <input
                                type="text"
                                placeholder="Házszám *"
                                value={houseNumber}
                                onChange={(e) => setHouseNumber(e.target.value)}
                                disabled={loading}
                                style={{
                                    flex: 1,
                                    padding: '12px 10px',
                                    borderRadius: '12px',
                                    border: '2px solid rgba(255,255,255,0.1)',
                                    background: 'rgba(0,0,0,0.3)',
                                    color: '#39FF14',
                                    fontSize: '14px',
                                    transition: 'all 0.3s ease'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#39FF14';
                                    e.target.style.boxShadow = '0 0 20px rgba(57, 255, 20, 0.3)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>

                        {/* Ajtó/emelet (opcionális) */}
                        <div>
                            <input
                                type="text"
                                placeholder="Ajtó/Emelet (opcionális)"
                                value={apartment}
                                onChange={(e) => setApartment(e.target.value)}
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '12px 10px',
                                    borderRadius: '12px',
                                    border: '2px solid rgba(255,255,255,0.1)',
                                    background: 'rgba(0,0,0,0.3)',
                                    color: '#39FF14',
                                    fontSize: '14px',
                                    transition: 'all 0.3s ease'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#39FF14';
                                    e.target.style.boxShadow = '0 0 20px rgba(57, 255, 20, 0.3)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>



                        <div>
                            <select
                                required
                                value={educationLevel}
                                onChange={(e) => setEducationLevel(e.target.value)}
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '15px',
                                    borderRadius: '12px',
                                    border: '2px solid rgba(255,255,255,0.1)',
                                    background: 'rgba(0,0,0,0.3)',
                                    color: '#39FF14',
                                    fontSize: '16px',
                                    transition: 'all 0.3s ease'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#39FF14';
                                    e.target.style.boxShadow = '0 0 20px rgba(57, 255, 20, 0.3)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            >
                                <option value="">Oktatási szint *</option>
                                {educationLevels.map(level => <option key={level} value={level}>{level}</option>)}
                            </select>
                        </div>

                        <div>
                            <textarea
                                placeholder="Pontosan miből kell a segítség? (pl. algebra, geometria, deriválás, integrálás, stb.)"
                                value={helpDescription}
                                onChange={(e) => setHelpDescription(e.target.value)}
                                disabled={loading}
                                rows={3}
                                style={{
                                    width: '100%',
                                    padding: '15px',
                                    borderRadius: '12px',
                                    border: '2px solid rgba(255,255,255,0.1)',
                                    background: 'rgba(0,0,0,0.3)',
                                    color: '#39FF14',
                                    fontSize: '16px',
                                    transition: 'all 0.3s ease',
                                    resize: 'vertical',
                                    fontFamily: 'Montserrat, sans-serif'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#39FF14';
                                    e.target.style.boxShadow = '0 0 20px rgba(57, 255, 20, 0.3)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>

                        <div>
                            <textarea
                                placeholder="Hobby, érdeklődési körök"
                                value={hobby}
                                onChange={(e) => setHobby(e.target.value)}
                                disabled={loading}
                                rows={3}
                                style={{
                                    width: '100%',
                                    padding: '15px',
                                    borderRadius: '12px',
                                    border: '2px solid rgba(255,255,255,0.1)',
                                    background: 'rgba(0,0,0,0.3)',
                                    color: '#39FF14',
                                    fontSize: '16px',
                                    transition: 'all 0.3s ease',
                                    resize: 'vertical',
                                    fontFamily: 'Montserrat, sans-serif'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#39FF14';
                                    e.target.style.boxShadow = '0 0 20px rgba(57, 255, 20, 0.3)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>

                        {/* Szabályzat elfogadás */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '12px',
                            padding: '15px',
                            borderRadius: '12px',
                            border: '2px solid rgba(255,255,255,0.1)',
                            background: 'rgba(0,0,0,0.2)',
                            transition: 'all 0.3s ease'
                        }}>
                            <input
                                type="checkbox"
                                id="terms-checkbox"
                                checked={acceptedTerms}
                                onChange={(e) => setAcceptedTerms(e.target.checked)}
                                disabled={loading}
                                style={{
                                    width: '18px',
                                    height: '18px',
                                    accentColor: '#39FF14',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    marginTop: '2px'
                                }}
                            />
                            <label
                                htmlFor="terms-checkbox"
                                style={{
                                    color: 'rgba(255,255,255,0.9)',
                                    fontSize: '14px',
                                    lineHeight: '1.5',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    userSelect: 'none'
                                }}
                            >
                                Elfogadom a{" "}
                                <span
                                    onClick={() => !loading && window.open('/terms', '_blank')}
                                    style={{
                                        color: '#39FF14',
                                        textDecoration: 'underline',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        fontWeight: '600'
                                    }}
                                >
                                    szabályzatot
                                </span>
                                {" "}és{" "}
                                <span
                                    onClick={() => !loading && window.open('/privacy', '_blank')}
                                    style={{
                                        color: '#39FF14',
                                        textDecoration: 'underline',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        fontWeight: '600'
                                    }}
                                >
                                    adatvédelmi tájékoztatót
                                </span>
                                . *
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading ||
                                !(password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password)) ||
                                !validatePhoneNumber(selectedCountryCode, phoneNumber).isValid ||
                                !postalCode.trim() || !city.trim() || !street.trim() || !houseNumber.trim() ||
                                !acceptedTerms
                            }
                            style={{
                                background: (!(password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password)) || !validatePhoneNumber(selectedCountryCode, phoneNumber).isValid || !postalCode.trim() || !city.trim() || !street.trim() || !houseNumber.trim() || !acceptedTerms) ?
                                    'rgba(255,255,255,0.1)' : 'linear-gradient(45deg, #39FF14, #FF49DB)',
                                color: (!(password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password)) || !validatePhoneNumber(selectedCountryCode, phoneNumber).isValid || !postalCode.trim() || !city.trim() || !street.trim() || !houseNumber.trim() || !acceptedTerms) ?
                                    'rgba(255,255,255,0.5)' : '#000',
                                border: 'none',
                                padding: '15px',
                                borderRadius: '12px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: (loading || !(password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password)) || !validatePhoneNumber(selectedCountryCode, phoneNumber).isValid || !postalCode.trim() || !city.trim() || !street.trim() || !houseNumber.trim() || !acceptedTerms) ? 'not-allowed' : 'pointer',
                                transition: 'all 0.3s ease',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                opacity: (loading || !(password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password)) || !validatePhoneNumber(selectedCountryCode, phoneNumber).isValid || !postalCode.trim() || !city.trim() || !street.trim() || !houseNumber.trim() || !acceptedTerms) ? 0.5 : 1
                            }}
                            onMouseEnter={(e) => {
                                if (!loading &&
                                    (password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password)) &&
                                    validatePhoneNumber(selectedCountryCode, phoneNumber).isValid &&
                                    postalCode.trim() && city.trim() && street.trim() && houseNumber.trim() &&
                                    acceptedTerms
                                ) {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(57, 255, 20, 0.3)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!loading &&
                                    (password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password)) &&
                                    validatePhoneNumber(selectedCountryCode, phoneNumber).isValid &&
                                    postalCode.trim() && city.trim() && street.trim() && houseNumber.trim() &&
                                    acceptedTerms
                                ) {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }
                            }}
                        >
                            {loading ? "Regisztrálás..." : "Regisztrálok"}
                        </button>

                        {msg && (
                            <div style={{
                                padding: '15px',
                                borderRadius: '12px',
                                background: msg.includes('Sikeres') ? 'rgba(57, 255, 20, 0.2)' : 'rgba(255, 73, 219, 0.2)',
                                color: msg.includes('Sikeres') ? '#39FF14' : '#FF49DB',
                                textAlign: 'center',
                                fontSize: '14px'
                            }}>
                                {msg}
                            </div>
                        )}
                    </form>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        margin: '20px 0',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            flex: 1,
                            height: '1px',
                            background: 'rgba(255, 255, 255, 0.2)'
                        }}></div>
                        <span style={{
                            padding: '0 1rem',
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '14px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>vagy</span>
                        <div style={{
                            flex: 1,
                            height: '1px',
                            background: 'rgba(255, 255, 255, 0.2)'
                        }}></div>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleRegister}
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '12px 20px',
                            background: '#ffffff',
                            border: '2px solid #dadce0',
                            borderRadius: '12px',
                            color: '#3c4043',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            opacity: loading ? 0.6 : 1
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) {
                                e.currentTarget.style.background = '#f8f9fa';
                                e.currentTarget.style.borderColor = '#c1c7cd';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!loading) {
                                e.currentTarget.style.background = '#ffffff';
                                e.currentTarget.style.borderColor = '#dadce0';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        {loading ? "Regisztrálás..." : "Regisztráció Google-lel"}
                    </button>

                    <div style={{
                        textAlign: 'center',
                        marginTop: '30px',
                        paddingTop: '20px',
                        borderTop: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <p style={{
                            margin: 0,
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: '14px'
                        }}>
                            Már van fiókod?{" "}
                            <Link href="/" style={{
                                color: '#39FF14',
                                textDecoration: 'none',
                                fontWeight: '600'
                            }}>
                                Bejelentkezés
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Image Cropping Modal */}
            {showCropper && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    padding: '20px',
                    pointerEvents: 'auto'
                }}>

                    <div style={{
                        background: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '20px',
                        padding: '30px',
                        maxWidth: '500px',
                        width: '100%',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <h3 style={{
                            margin: '0 0 20px 0',
                            color: '#39FF14',
                            textAlign: 'center'
                        }}>
                            Állítsd be a profilképed
                        </h3>

                        <div
                            style={{
                                position: 'relative',
                                width: '120px',
                                height: '120px',
                                margin: '0 auto 20px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                border: '3px solid #39FF14',
                                background: '#000',
                                cursor: 'grab',
                                userSelect: 'none'
                            }}
                            onWheel={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const delta = e.deltaY > 0 ? -0.1 : 0.1;
                                setCropPosition(prev => ({
                                    ...prev,
                                    scale: Math.max(0.5, Math.min(3, prev.scale + delta))
                                }));
                            }}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const container = e.currentTarget;
                                container.style.cursor = 'grabbing';

                                const startX = e.clientX;
                                const startY = e.clientY;
                                const startPosX = cropPosition.x;
                                const startPosY = cropPosition.y;

                                const handleMouseMove = (moveEvent: MouseEvent) => {
                                    moveEvent.preventDefault();
                                    const deltaX = moveEvent.clientX - startX;
                                    const deltaY = moveEvent.clientY - startY;

                                    const newX = Math.max(-60, Math.min(60, startPosX + deltaX));
                                    const newY = Math.max(-60, Math.min(60, startPosY + deltaY));

                                    setCropPosition(prev => ({
                                        ...prev,
                                        x: newX,
                                        y: newY
                                    }));
                                };

                                const handleMouseUp = () => {
                                    container.style.cursor = 'grab';
                                    document.removeEventListener('mousemove', handleMouseMove);
                                    document.removeEventListener('mouseup', handleMouseUp);
                                };

                                document.addEventListener('mousemove', handleMouseMove);
                                document.addEventListener('mouseup', handleMouseUp);
                            }}
                        >
                            <img
                                src={originalImage}
                                alt="Crop preview"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transform: `scale(${cropPosition.scale}) translate(${cropPosition.x}px, ${cropPosition.y}px)`,
                                    transition: 'none',
                                    pointerEvents: 'none',
                                    userSelect: 'none'
                                }}
                                draggable={false}
                                onLoad={(e) => {
                                    const img = e.currentTarget;
                                    console.log('Original image loaded:', img.naturalWidth, 'x', img.naturalHeight);
                                    console.log('Aspect ratio:', img.naturalWidth / img.naturalHeight);
                                }}
                            />
                        </div>

                        <div style={{
                            textAlign: 'center',
                            marginBottom: '30px',
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: '14px'
                        }}>
                            <p style={{ margin: '0 0 10px 0' }}>
                                <strong>Nagyítás:</strong> {Math.round(cropPosition.scale * 100)}%
                            </p>
                            <p style={{ margin: '0 0 10px 0' }}>
                                <strong>Használat:</strong> Görgetés a nagyításhoz, egér húzás a mozgatáshoz
                            </p>
                        </div>

                        <div style={{
                            display: 'flex',
                            gap: '15px',
                            justifyContent: 'center'
                        }}>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowCropper(false);
                                    setOriginalImage("");
                                    setCropPosition({ x: 0, y: 0, scale: 1 });
                                }}
                                style={{
                                    background: 'rgba(255,255,255,0.1)',
                                    border: '1px solid rgba(255,255,255,0.3)',
                                    color: 'white',
                                    padding: '12px 25px',
                                    borderRadius: '25px',
                                    cursor: 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                Mégse
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    // Create cropped image
                                    const canvas = document.createElement('canvas');
                                    const ctx = canvas.getContext('2d');
                                    const img = new Image();

                                    img.onload = () => {
                                        canvas.width = 120;
                                        canvas.height = 120;

                                        if (ctx) {
                                            ctx.save();
                                            ctx.beginPath();
                                            ctx.arc(60, 60, 60, 0, 2 * Math.PI);
                                            ctx.clip();

                                            // Cropping logika pontosan ugyanazzal a számítással, mint a CSS object-fit: cover
                                            const containerSize = 120;

                                            // Az eredeti kép arányai
                                            const imageAspectRatio = img.width / img.height;
                                            const containerAspectRatio = 1; // kör

                                            // object-fit: cover szimulálása
                                            let coverWidth, coverHeight;
                                            if (imageAspectRatio > containerAspectRatio) {
                                                // A kép szélesebb, mint magas - magasság alapján méretezve
                                                coverHeight = containerSize;
                                                coverWidth = coverHeight * imageAspectRatio;
                                            } else {
                                                // A kép magasabb, mint széles - szélesség alapján méretezve
                                                coverWidth = containerSize;
                                                coverHeight = coverWidth / imageAspectRatio;
                                            }

                                            // A kép mérete a scale-zel
                                            const displayWidth = coverWidth * cropPosition.scale;
                                            const displayHeight = coverHeight * cropPosition.scale;

                                            // object-fit: cover középre igazítása + transform
                                            const coverX = (containerSize - coverWidth) / 2;
                                            const coverY = (containerSize - coverHeight) / 2;
                                            const imageX = coverX + (coverWidth - displayWidth) / 2 + cropPosition.x;
                                            const imageY = coverY + (coverHeight - displayHeight) / 2 + cropPosition.y;

                                            console.log('Cropping with:', {
                                                originalSize: `${img.width}x${img.height}`,
                                                aspectRatio: imageAspectRatio,
                                                coverSize: `${Math.round(coverWidth)}x${Math.round(coverHeight)}`,
                                                scale: cropPosition.scale,
                                                x: cropPosition.x,
                                                y: cropPosition.y,
                                                displayWidth: Math.round(displayWidth),
                                                displayHeight: Math.round(displayHeight),
                                                imageX: Math.round(imageX),
                                                imageY: Math.round(imageY)
                                            });

                                            ctx.drawImage(img, imageX, imageY, displayWidth, displayHeight);
                                            ctx.restore();

                                            const croppedImageUrl = canvas.toDataURL('image/jpeg', 0.9);
                                            console.log('Cropped image created, setting profileImagePreview');
                                            setProfileImagePreview(croppedImageUrl);
                                            setShowCropper(false);
                                            setOriginalImage("");
                                            setCropPosition({ x: 0, y: 0, scale: 1 });
                                        }
                                    };

                                    img.src = originalImage;
                                }}
                                style={{
                                    background: 'linear-gradient(45deg, #39FF14, #FF49DB)',
                                    border: 'none',
                                    color: '#000',
                                    padding: '12px 25px',
                                    borderRadius: '25px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '600'
                                }}
                            >
                                Mentés
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes shimmer {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
                
                @keyframes bounce {
                    0%, 100% {
                        transform: translate(0px, 0px);
                    }
                    25% {
                        transform: translate(50px, -30px);
                    }
                    50% {
                        transform: translate(-30px, 40px);
                    }
                    75% {
                        transform: translate(40px, 20px);
                    }
                }
                
                @keyframes float {
                    0% {
                        transform: translate(0px, 0px);
                    }
                    25% {
                        transform: translate(100px, -50px);
                    }
                    50% {
                        transform: translate(-80px, 80px);
                    }
                    75% {
                        transform: translate(120px, 40px);
                    }
                    100% {
                        transform: translate(0px, 0px);
                    }
                }
                
                @keyframes bounce {
                    0% {
                        transform: translate(0px, 0px);
                    }
                    25% {
                        transform: translate(150px, -100px);
                    }
                    50% {
                        transform: translate(-120px, 120px);
                    }
                    75% {
                        transform: translate(180px, 60px);
                    }
                    100% {
                        transform: translate(0px, 0px);
                    }
                }
                
                @keyframes moveHorizontal {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100vw);
                    }
                }
                
                @keyframes moveVertical {
                    0% {
                        transform: translateY(-100%);
                    }
                    100% {
                        transform: translateY(100vh);
                    }
                }
            `}</style>

            {/* Cookie Banner */}
            <CookieBanner />
        </>
    );
}
