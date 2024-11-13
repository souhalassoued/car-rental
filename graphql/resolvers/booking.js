const Car = require('../../Models/cars');
const Booking = require('../../models/booking');
const { transformBooking, transformCar } = require('./merge');

module.exports = {
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const bookings = await Booking.find();
      return bookings.map(booking => {
        return transformBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },
  bookCar: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    const fetchedCar = await Car.findOne({ _id: args.carId });
    const booking = new Booking({
      user: req.userId,
      car: fetchedCar
    });
    const result = await booking.save();
    return transformBooking(result);
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const booking = await Booking.findById(args.bookingId).populate('car');
      const car = transformCar(booking.car);
      await Booking.deleteOne({ _id: args.bookingId });
      return car;
    } catch (err) {
      throw err;
    }
  }
};