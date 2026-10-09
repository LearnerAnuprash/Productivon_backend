import { authTypeDefs } from "./auth.typeDefs";
import { baseTypeDefs } from "./base";
import { userTypeDefs } from "./user.typeDefs";

export const typeDefs = [baseTypeDefs, authTypeDefs, userTypeDefs];
