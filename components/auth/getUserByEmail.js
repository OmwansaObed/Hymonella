import connectDB from "@/lib/connectDB";
import User from "@/models/user.model";

export async function getUserByEmail(email) {
  await connectDB();
  const user = await User.findOne({ email }).lean();
  return user;
}
