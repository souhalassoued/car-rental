const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');

const mongoose = require('mongoose');
const graphiQlSchema = require('./graphql/schema/index');
const graphiQlResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');

const app = express();
app.use(isAuth);
const mongoUri = 'mongodb+srv://souha1:souha1@cluster1.2xsp5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1';

// Connect to MongoDB
const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    console.log('Already connected to MongoDB');
    return; // Skip connection if already connected
  }
  if (mongoose.connection.readyState === 2) {
    console.log('Connection to MongoDB is currently in progress');
    return; // Skip if the connection is being established
  }
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process with failure
  }
};


connectToDatabase();

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(isAuth);

app.use(
  '/graphql',
  graphqlHTTP({
    schema:graphiQlSchema,
    rootValue: graphiQlResolvers ,
    graphiql: true
  })
);

// Start the server only after successful DB connection
mongoose.connection.once('open', () => {
  app.listen(8000, () => {
    console.log('Server is running on port 8000');
  });
});
