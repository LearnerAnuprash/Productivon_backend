import User from "../models/User.js";

export const resolvers = {
  Query: {
    users: async () => await User.findAll(),
    user: async (_: any, { id }: { id: string }) => await User.findByPk(id),
  },
  Mutation: {
    createUser: async (_: any, args: { name: string; email: string }) => {
      return await User.create(args);
    },
  },
};
