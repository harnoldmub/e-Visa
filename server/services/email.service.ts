import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

export async function sendDraftConfirmationEmail(application: any) {
    if (!resend) {
        console.warn("⚠️ Resend API key not configured, skipping email");
        console.log("📧 Email would be sent to:", application.email);
        return null;
    }

    const baseUrl = process.env.PUBLIC_BASE_URL || "http://localhost:3000";
    const resumeLink = `${baseUrl}/apply?resume=${application.id}`;

    // En mode développement, envoyer uniquement à l'email vérifié
    const isDevelopment = process.env.NODE_ENV === "development";
    const toEmail = isDevelopment ? "arnold@mubuanga.com" : application.email;

    if (isDevelopment) {
        console.log(`📧 [DEV MODE] Email will be sent to ${toEmail} instead of ${application.email}`);
    }

    try {
        const result = await resend.emails.send({
            from: "e-Visa RDC <onboarding@resend.dev>",
            to: toEmail,
            subject: `Demande initiée - ${application.applicationNumber}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af;">Demande de visa initiée</h2>
          <p>Bonjour ${application.firstName} ${application.lastName},</p>
          <p>Votre demande de visa a été initiée avec succès.</p>
          <p><strong>Référence temporaire:</strong> ${application.applicationNumber}</p>
          ${isDevelopment ? `<p><em style="color: #6b7280;">Note: Email envoyé à ${toEmail} (mode développement)</em></p>` : ""}
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>📝 Continuer votre demande</strong></p>
            <p style="margin: 0 0 15px 0;">Vous pouvez reprendre votre demande à tout moment en cliquant sur le bouton ci-dessous :</p>
            <a href="${resumeLink}" 
               style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Continuer ma demande
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">
            💡 <strong>Conseil :</strong> Sauvegardez ce lien pour reprendre votre demande plus tard si vous ne la terminez pas maintenant.
          </p>
          
          <p>Cordialement,<br/>Direction Générale de Migration (DGM)</p>
        </div>
      `,
        });

        console.log("✅ Email sent successfully to:", toEmail);
        return result;
    } catch (error: any) {
        console.error("❌ Error sending email:", error);
        console.error("Error details:", error.message);
        return null;
    }
}

export async function sendApplicationSubmittedEmail(application: any) {
    if (!resend) {
        console.warn("Resend API key not configured, skipping email");
        return null;
    }

    const isDevelopment = process.env.NODE_ENV === "development";
    const toEmail = isDevelopment ? "arnold@mubuanga.com" : application.email;

    try {
        const result = await resend.emails.send({
            from: "e-Visa RDC <onboarding@resend.dev>",
            to: toEmail,
            subject: `Demande soumise - ${application.applicationNumber}`,
            html: `
        <h2>Demande de visa soumise</h2>
        <p>Bonjour ${application.firstName} ${application.lastName},</p>
        <p>Votre demande de visa a été soumise avec succès et est en cours de traitement.</p>
        <p><strong>Numéro de dossier:</strong> ${application.applicationNumber}</p>
        <p>Vous pouvez suivre l'état de votre demande à tout moment sur notre site.</p>
        <p>Cordialement,<br/>Direction Générale de Migration (DGM)</p>
      `,
        });

        console.log("Email sent:", result);
        return result;
    } catch (error) {
        console.error("Error sending email:", error);
        return null;
    }
}

export async function sendStatusUpdateEmail(application: any, newStatus: string) {
    if (!resend) {
        console.warn("Resend API key not configured, skipping email");
        return null;
    }

    const statusMessages: Record<string, string> = {
        UNDER_REVIEW: "est en cours d'examen",
        NEED_INFO: "nécessite des informations complémentaires",
        APPROVED: "a été approuvée",
        REJECTED: "a été rejetée",
        ISSUED: "a été approuvée et votre e-Visa est disponible",
    };

    const message = statusMessages[newStatus] || "a été mise à jour";

    const isDevelopment = process.env.NODE_ENV === "development";
    const toEmail = isDevelopment ? "arnold@mubuanga.com" : application.email;

    try {
        const result = await resend.emails.send({
            from: "e-Visa RDC <onboarding@resend.dev>",
            to: toEmail,
            subject: `Mise à jour de votre demande - ${application.applicationNumber}`,
            html: `
        <h2>Mise à jour de votre demande de visa</h2>
        <p>Bonjour ${application.firstName} ${application.lastName},</p>
        <p>Votre demande de visa ${message}.</p>
        <p><strong>Numéro de dossier:</strong> ${application.applicationNumber}</p>
        ${newStatus === "ISSUED"
                    ? `<p><strong>Votre e-Visa est prêt !</strong> Vous pouvez le télécharger depuis votre espace de suivi.</p>`
                    : ""
                }
        <p>Cordialement,<br/>Direction Générale de Migration (DGM)</p>
      `,
        });

        console.log("Email sent:", result);
        return result;
    } catch (error) {
        console.error("Error sending email:", error);
        return null;
    }
}
