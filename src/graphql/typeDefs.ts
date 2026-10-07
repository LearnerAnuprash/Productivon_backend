import { gql } from "graphql-tag";

export const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    name: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
  }

  type Mutation {
    signup(
      email: String!
      password: String!
      confirmPassword: String!
    ): AuthPayload!

    login(email: String!, password: String!): AuthPayload!
  }
`;
