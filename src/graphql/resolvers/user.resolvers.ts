import User from "../../models/User";

type userIdContext = {
  userId: number | null;
};
export const userResolvers = {
  Query: {
    me: async (_: unknown, __: unknown, context: userIdContext) => {
      if (!context.userId) throw new Error("User not authenticated.");
      const user = await User.findByPk(context.userId);
      if (!user) throw new Error("User not found.");
      return user;
    },
  },
};
