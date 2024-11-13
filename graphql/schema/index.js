const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type Booking {
    _id: ID!
    car: Car!
    user: User!
    createdAt: String!
    updatedAt: String!
}
  type Car {
    _id: ID!
    marque: String!
    description: String!
    price: Float!
    date: String!
    creator: User!
  }
  type User {
    _id: ID!
    email: String!
    password: String
    createdCars: [Car!]
  }
  type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
  }
  input CarInput {
    marque: String!
    description: String!
    price: Float!
    date: String!
  }
  input UserInput {
    email: String!
    password: String!
  }
  type RootQuery {
    cars: [Car!]!
    users: [User!]!
    bookings: [Booking!]!
    login(email: String!, password: String!): AuthData!
  }
    
  type RootMutation {
    createCar(carInput: CarInput): Car
    createUser(userInput: UserInput): User
    bookCar(carId: ID!): Booking!
    cancelBooking(bookingId: ID!): Car!
  }
  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
