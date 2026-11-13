import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Section,
  Text,
  Hr,
} from '@react-email/components';

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({
  username,
  otp,
}: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verify Your Email Address</title>

        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>

      <Preview>
        Your verification code is {otp}. Complete your registration.
      </Preview>

      <Section style={main}>
        <Section style={container}>
          <Heading style={heading}>
            Verify Your Email
          </Heading>

          <Text style={paragraph}>
            Hello {username},
          </Text>

          <Text style={paragraph}>
            Thank you for registering with us! To complete your
            registration, please use the verification code below.
          </Text>

          <Section style={codeContainer}>
            <Text style={codeLabel}>
              YOUR VERIFICATION CODE
            </Text>

            <Text style={code}>
              {otp}
            </Text>
          </Section>

          <Text style={paragraph}>
            This verification code is valid for 10 minutes.
            Please do not share this code with anyone.
          </Text>

          <Hr style={divider} />

          <Text style={footer}>
            If you did not create an account, you can safely
            ignore this email.
          </Text>

          <Text style={copyright}>
            © {new Date().getFullYear()} All rights reserved.
          </Text>
        </Section>
      </Section>
    </Html>
  );
}

const main = {
  backgroundColor: '#f4f4f5',
  padding: '40px 0',
};

const container = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  padding: '40px 30px',
  maxWidth: '480px',
  margin: '0 auto',
};

const heading = {
  color: '#18181b',
  fontSize: '26px',
  fontWeight: '700',
  textAlign: 'center' as const,
  margin: '0 0 30px',
};

const paragraph = {
  color: '#52525b',
  fontSize: '15px',
  lineHeight: '24px',
};

const codeContainer = {
  backgroundColor: '#f4f4f5',
  borderRadius: '10px',
  padding: '20px',
  textAlign: 'center' as const,
  margin: '25px 0',
};

const codeLabel = {
  color: '#71717a',
  fontSize: '11px',
  fontWeight: '600',
  letterSpacing: '2px',
};

const code = {
  color: '#18181b',
  fontSize: '32px',
  fontWeight: '700',
  letterSpacing: '8px',
  margin: '10px 0 0',
};

const divider = {
  borderColor: '#e4e4e7',
  margin: '30px 0 20px',
};

const footer = {
  color: '#71717a',
  fontSize: '13px',
  lineHeight: '20px',
  textAlign: 'center' as const,
};

const copyright = {
  color: '#a1a1aa',
  fontSize: '11px',
  textAlign: 'center' as const,
  marginTop: '20px',
};
