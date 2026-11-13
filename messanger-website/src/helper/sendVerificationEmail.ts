import { render } from '@react-email/components';
import { getResendClient } from '@/lib/resend';
import VerificationEmail from '../../emails/VerificationEmail';
import type { ApiResponse } from '@/types/ApiResponse';

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const resend = getResendClient();
    const html = await render(
      VerificationEmail({ username, otp: verifyCode })
    );

    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: 'Messanger Verification Code',
      html,
    });

    if (error) throw new Error(error.message);
    return { success: true, message: 'Verification email sent successfully.' };
  } catch (emailError) {
    console.error('Error sending verification email:', emailError);
    return { success: false, message: 'Failed to send verification email.' };
  }
}