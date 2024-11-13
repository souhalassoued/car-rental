import React from 'react';

const BookingList = (props) => (
  <ul className="space-y-4">
    {props.bookings.map((booking) => (
      <li
        key={booking._id}
        className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
      >
        <div className="text-gray-800 font-medium">
          {booking.car.marque} -{' '}
          <span className="text-gray-500">
            {new Date(booking.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            onClick={props.onDelete.bind(this, booking._id)}
          >
            Cancel
          </button>
        </div>
      </li>
    ))}
  </ul>
);

export default BookingList;
