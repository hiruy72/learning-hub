import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
    to,
    subject,
    html,
}: {
    to: string;
    subject: string;
    html: string;
}) {
    try {
        const { data, error } = await resend.emails.send({
            from: "Mentorship Platform <onboarding@resend.dev>", // Default Resend domain
            to,
            subject,
            html,
        });

        if (error) {
            console.error("Email error:", error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error("Email exception:", error);
        return { success: false, error };
    }
}
