import "server-only";

import { Resend } from 'resend';

export const getResend = () => {
    const resend = new Resend(process.env.RESEND_API_KEY!);
    return resend;
}