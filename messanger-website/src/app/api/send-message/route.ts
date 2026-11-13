import UserModel from '@/model/User';
import dbConnect from '@/lib/dbConnect';
import { messageSchema } from '@/schema/messageSchema';
import { usernameValidation } from '@/schema/signUpSchema';
import { getClientIp, rateLimit } from '@/lib/rateLimit';

export async function POST(request: Request) {
  try {
    const limit = rateLimit(`send:${getClientIp(request)}`, 10, 60_000);
    if (!limit.ok) {
      return Response.json(
        { success: false, message: `You are sending messages too quickly. Try again in ${limit.retryAfter} seconds.` },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
      );
    }
    const body = await request.json();
    const usernameResult = usernameValidation.safeParse(body.username);
    const messageResult = messageSchema.safeParse({ content: body.content });
    if (!usernameResult.success || !messageResult.success) {
      return Response.json({ success: false, message: 'Enter a valid username and a message between 10 and 300 characters.' }, { status: 400 });
    }
    await dbConnect();
    const username = usernameResult.data;
    const { content } = messageResult.data;
    const usernameQuery = new RegExp(`^${username}$`, 'i');
    const profile = await UserModel.findOne({ username: usernameQuery, isVerified: true })
      .select('_id isAcceptingMessages')
      .lean();

    if (!profile) {
      return Response.json(
        { message: 'User not found. Check that the profile link is correct and the account is verified.', success: false },
        { status: 404 }
      );
    }
    if (!profile.isAcceptingMessages) {
      return Response.json(
        { message: 'User is not accepting messages', success: false },
        { status: 403 }
      );
    }

    const user = await UserModel.findOneAndUpdate(
      { _id: profile._id, isVerified: true, isAcceptingMessages: true },
      { $push: { messages: { content, createdAt: new Date() } } },
      { returnDocument: 'before', projection: { _id: 1 } }
    ).exec();

    if (!user) {
      return Response.json(
        { message: 'User stopped accepting messages. Please try again later.', success: false },
        { status: 403 }
      );
    }

    return Response.json(
      { message: 'Message sent successfully', success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding message:', error);
    return Response.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}
