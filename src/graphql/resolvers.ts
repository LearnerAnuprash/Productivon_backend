import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { signupSchema } from "../schema/signup-schema";
import { loginSchema } from "../schema/login-schema";

const JWT_SECRET = process.env.JWT_SECRET as string;

type userIdCtx = {
  userId: number | null;
};

const generateToken = (userId: number) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1d" });
};

export const resolvers = {
  Query: {
    me: async (_: unknown, __: unknown, userIdCtx: userIdCtx) => {
      if (!userIdCtx.userId) throw new Error("User not authenticated.");
      const user = await User.findByPk(userIdCtx.userId);
      if (!user) throw new Error("User not found.");
      return user;
    },
  },
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
      const hashedConfirmPassword = await bcrypt.hash(
        validatedData.confirmPassword,
        10,
      );
      if (hashedPassword !== hashedConfirmPassword)
        throw new Error("Password and Confirm password don't match.");

      const user = await User.create({
        email: args.email,
        password: args.password,
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
