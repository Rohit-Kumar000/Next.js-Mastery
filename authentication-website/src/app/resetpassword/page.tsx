import ResetPasswordForm from "./ResetPasswordForm";

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string | string[] }>;
}

// The token comes from the link in the email: /resetpassword?token=...
export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token } = await searchParams;

  return <ResetPasswordForm token={Array.isArray(token) ? token[0] : token} />;
}
