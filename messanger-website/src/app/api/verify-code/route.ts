import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { usernameValidation } from '@/schema/signUpSchema';
import { verifySchema } from '@/schema/verifySchema';
import { getClientIp, rateLimit } from '@/lib/rateLimit';

export async function POST(request: Request) {
  try {
    const limit = rateLimit(`verify:${getClientIp(request)}`, 10, 60_000);
    if (!limit.ok) {
      return Response.json(
        { success: false, message: `Too many attempts. Try again in ${limit.retryAfter} seconds.` },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
      );
    }

    const body = await request.json();
    const username = usernameValidation.safeParse(
      typeof body?.username === 'string' ? decodeURIComponent(body.username) : ''
    );
    const code = verifySchema.safeParse({ code: body?.code });

    if (!username.success || !code.success) {
      return Response.json(
        { success: false, message: code.success ? 'Invalid username' : 'Enter the 6-digit verification code' },
        { status: 400 }
      );
    }

    await dbConnect();
    const user = await UserModel.findOne({ username: username.data.toLowerCase() });

    if (!user) {
      return Response.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    if (user.isVerified) {
      return Response.json(
        { success: true, message: 'Account is already verified. You can sign in.' },
        { status: 200 }
      );
    }

    const isCodeValid = user.verifyCode === code.data.code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        { success: true, message: 'Account verified successfully' },
        { status: 200 }
      );
    }

    if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: 'Verification code has expired. Please sign up again to get a new code.',
        },
        { status: 400 }
      );
    }

    return Response.json(
      { success: false, message: 'Incorrect verification code' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error verifying user:', error);
    return Response.json(
      { success: false, message: 'Error verifying user' },
      { status: 500 }
    );
  }
}
