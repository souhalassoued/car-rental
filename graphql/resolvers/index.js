const authResolver = require('./auth');
const carsResolver = require('./car'); 
const bookingResolver = require('./booking');
const rootResolver = {
  ...authResolver,
  ...carsResolver,
  ...bookingResolver
};

module.exports = rootResolver;
