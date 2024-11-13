import React from 'react';
import CarItem from './CarItem/CarItem';

const CarList = (props) => {
  const cars = props.cars.map((car) => {
    return (
      <CarItem
        key={car._id}
        carId={car._id}
        marque={car.marque}
        price={car.price}
        date={car.date}
        userId={props.authUserId}
        creatorId={car.creator._id}
        onDetail={props.onViewDetail}
      />
    );
  });

  return (
    <ul className="car-list grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4">
      {cars}
    </ul>
  );
};

export default CarList;
