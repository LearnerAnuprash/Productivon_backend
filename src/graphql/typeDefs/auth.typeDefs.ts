import gql from "graphql-tag";

export const authTypeDefs = gql`
  type AuthPayload {
    token: String!
    user: User!
  }

  extend type Mutation {
    signup(
      email: String!
      password: String!
      confirmPassword: String!
    ): AuthPayload!

    login(email: String!, password: String!): AuthPayload!
  }
`;
