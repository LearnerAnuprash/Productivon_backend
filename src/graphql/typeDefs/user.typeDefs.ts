import { gql } from "graphql-tag";

export const userTypeDefs = gql`
  type User {
    id: ID!
    email: String!
    name: String
  }

  extend type Query {
    me: User
  }
`;
