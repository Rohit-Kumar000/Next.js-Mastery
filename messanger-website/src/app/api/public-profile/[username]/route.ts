import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { usernameValidation } from '@/schema/signUpSchema';

export async function GET(_request: Request, { params }: { params: Promise<{ username: string }> }) {
  try {
    const { username } = await params;
    const parsedUsername = usernameValidation.safeParse(username);
    if (!parsedUsername.success) return Response.json({ success: false, message: 'This profile could not be found.' }, { status: 404 });
    await dbConnect();
    const user = await UserModel.findOne({ username: new RegExp(`^${parsedUsername.data}$`, 'i'), isVerified: true }).select('username isAcceptingMessages').lean();
    if (!user) return Response.json({ success: false, message: 'This profile could not be found.' }, { status: 404 });
    return Response.json({ success: true, username: user.username, isAcceptingMessages: user.isAcceptingMessages });
  } catch (error) {
    console.error('Unable to load public profile:', error);
    return Response.json({ success: false, message: 'Unable to load this profile right now.' }, { status: 500 });
  }
}
