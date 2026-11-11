import VerifyEmail from "./VerifyEmail";

interface VerifyPageProps {
  searchParams: Promise<{ token?: string | string[] }>;
}

// The token comes from the link in the email: /verify?token=...
export default async function VerifyPage({ searchParams }: VerifyPageProps) {
  const { token } = await searchParams;

  return <VerifyEmail token={Array.isArray(token) ? token[0] : token} />;
}
