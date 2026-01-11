import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    role: String!
    orders: [Order]
  }

  type Product {
    id: ID!
    title: String!
    description: String
    price: Float!
    image: String
  }

  type Order {
    id: ID!
    user: User!
    items: [OrderItem!]!
    status: String!
    createdAt: String!
    total: Float!
  }

  type OrderItem {
    product: Product!
    quantity: Int!
    price: Float!
  }

  type Query {
    products: [Product!]
    orders: [Order!]
    order(id: ID!): Order
    users: [User!]!
  }

  type Mutation {
    addOrder(items: [OrderInput!]!): Order!
    updateOrderStatus(id: ID!, status: String!): Order
    deleteUser(id: ID!): String
    updateUserRole(id: ID!, role: String!): User
  }

  input OrderInput {
    product: ID!
    quantity: Int!
  }
`;