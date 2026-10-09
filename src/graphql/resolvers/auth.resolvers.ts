import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import User from "../../models/User";
import { loginSchema } from "../../schema/login-schema";
import { signupSchema } from "../../schema/signup-schema";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"];

const generateToken = (userId: number) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const authResolvers = {
  Mutation: {
    signup: async (
      _: unknown,
      args: { email: string; password: string; confirmPassword: string },
    ) => {
      const validatedData = signupSchema.parse(args);
      const userExists = await User.findOne({
        where: { email: validatedData.email },
      });
      if (userExists)
        throw new Error(
          "Duplicate Email Adress for this user. Please login instead.",
        );
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      const user = await User.create({
        email: validatedData.email,
        password: hashedPassword,
      });

      return { token: generateToken(user.id) };
    },
    login: async (_: unknown, args: { email: string; password: string }) => {
      const validatedData = loginSchema.parse(args);
      const user = await User.findOne({
        where: { email: validatedData.email },
      });
      if (!user) throw new Error("Invalid email or password.");
      const isPasswordMatched = await bcrypt.compare(
        validatedData.password,
        user.password,
      );
      if (!isPasswordMatched) throw new Error("Invalid email or password");

      return { token: generateToken(user.id), user };
    },
  },
};
