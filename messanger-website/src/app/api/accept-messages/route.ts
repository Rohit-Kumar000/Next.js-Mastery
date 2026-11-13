import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { acceptMessageSchema } from '@/schema/acceptMessageSchema';

async function authenticatedUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?._id) return null;
  return session.user;
}

export async function GET() {
  try {
    const user = await authenticatedUser();
    if (!user) return Response.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    await dbConnect();
    const foundUser = await UserModel.findById(user._id).select('isAcceptingMessages').lean();
    if (!foundUser) return Response.json({ success: false, message: 'User not found' }, { status: 404 });
    return Response.json({ success: true, isAcceptingMessages: foundUser.isAcceptingMessages });
  } catch (error) {
    console.error('Unable to load message settings:', error);
    return Response.json({ success: false, message: 'Unable to load message settings.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await authenticatedUser();
    if (!user) return Response.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    const result = acceptMessageSchema.safeParse(await request.json());
    if (!result.success) return Response.json({ success: false, message: 'Invalid message settings.' }, { status: 400 });
    await dbConnect();
    const updated = await UserModel.findByIdAndUpdate(user._id, { isAcceptingMessages: result.data.acceptMessages }, { new: true, select: '_id' });
    if (!updated) return Response.json({ success: false, message: 'User not found' }, { status: 404 });
    return Response.json({ success: true, message: 'Message settings updated.' });
  } catch (error) {
    console.error('Unable to update message settings:', error);
    return Response.json({ success: false, message: 'Unable to update message settings.' }, { status: 500 });
  }
}
