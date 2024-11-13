import React from 'react';

const CarItem = (props) => (
  <li
    key={props.carId}
    className="flex flex-col bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
  >
    {/* Car Details */}
    <div className="p-6 flex flex-col justify-between flex-grow">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{props.marque}</h1>
        <h2 className="text-lg text-gray-600">
          <span className="font-semibold text-blue-500">${props.price}</span> •{' '}
          <span>{new Date(props.date).toLocaleDateString()}</span>
        </h2>
      </div>

      <div className="mt-6">
        {props.userId === props.creatorId ? (
          <p className="text-sm text-green-600 font-semibold">You own this car</p>
        ) : (
          <button
            className="w-full mt-4 px-5 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            onClick={() => props.onDetail(props.carId)}
          >
            View Details
          </button>
        )}
      </div>
    </div>
  </li>
);

export default CarItem;
