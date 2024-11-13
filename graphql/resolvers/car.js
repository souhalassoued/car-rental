const { dateToString } = require('../../helpers/date');
const Car = require('../../Models/cars');
const User = require('../../Models/users');
const { transformCar } = require('./merge');

const resolvers = {
  cars: async () => {
    try {
      const cars = await Car.find().populate('creator');
      return cars.map((car) => transformCar(car));
    } catch (err) {
      console.error('Error fetching cars:', err);
      throw err;
    }
  },

  createCar: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    const car = new Car({
      marque: args.carInput.marque,
      description: args.carInput.description,
      price: +args.carInput.price,
      date: new Date(args.carInput.date),
      creator: req.userId,
    });

    let createdCar;
    try {
      const result = await car.save();
      createdCar = transformCar(result);

      const creator = await User.findById(req.userId);
      if (!creator) {
        throw new Error('User not found.');
      }
      creator.createdCars.push(car);
      await creator.save();

      return createdCar;
    } catch (err) {
      console.error('Error creating car:', err);
      throw err;
    }
  },
};

module.exports = resolvers;
