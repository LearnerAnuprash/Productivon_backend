import { authResolvers } from "./auth.resolvers";
import { userResolvers } from "./user.resolvers";

export const resolvers = {
  Query: {
    ...userResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
  },
};
