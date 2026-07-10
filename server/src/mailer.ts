import nodemailer from "nodemailer";

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, ADMIN_EMAIL } = process.env;

const smtpConfigured = Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);

if (!ADMIN_EMAIL) {
  console.warn(
    "[mailer] ADMIN_EMAIL is not set — password-reset codes have nowhere to send. Set it in server/.env."
  );
}

if (!smtpConfigured) {
  console.warn(
    "[mailer] SMTP_HOST/SMTP_USER/SMTP_PASS are not fully set — reset codes will be printed to the " +
      "console instead of emailed. Fine for local dev, not for a real deployment."
  );
}

const transporter = smtpConfigured
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT ?? 587),
      secure: Number(SMTP_PORT ?? 587) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })
  : null;

export function getAdminEmail(): string | null {
  return ADMIN_EMAIL ?? null;
}

export async function sendPasswordResetEmail(code: string): Promise<void> {
  const to = ADMIN_EMAIL;

  if (!transporter || !to) {
    console.warn(`[mailer] Password reset code (not emailed — see warnings above): ${code}`);
    return;
  }

  await transporter.sendMail({
    from: SMTP_FROM || SMTP_USER,
    to,
    subject: "Dice WiFi admin — password reset code",
    text: `Your password reset code is ${code}. It expires in 15 minutes. If you didn't request this, you can ignore this email.`,
    html: `<p>Your password reset code is <b style="font-size:1.2em">${code}</b>.</p><p>It expires in 15 minutes. If you didn't request this, you can ignore this email.</p>`,
  });
}
