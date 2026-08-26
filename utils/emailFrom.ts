/**
 * Egységes feladó — „Mihaszna Matek”, ne Firebase noreply.
 * Gmail SMTP / App Password kell; a Firebase beépített levél mindig noreply@…firebaseapp.com.
 */
export function emailFromAddress(): string {
    return (
        process.env.EMAIL_FROM ||
        process.env.GMAIL_USER ||
        'usezsolti@gmail.com'
    ).trim();
}

export function emailFromName(): string {
    return (process.env.EMAIL_FROM_NAME || 'Mihaszna Matek').trim();
}

/** nodemailer `from` mező: "Mihaszna Matek" <usezsolti@gmail.com> */
export function emailFromHeader(): string {
    const name = emailFromName().replace(/"/g, '');
    return `"${name}" <${emailFromAddress()}>`;
}
