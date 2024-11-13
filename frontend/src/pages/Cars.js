import React, { useState, useEffect, useContext, useRef } from 'react';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import CarList from '../components/Cars/CarList/CarList';
import Spinner from '../components/Spinner/Spinner';
import AuthContext from '../context/auth-context';

const CarsPage = () => {
  const [creating, setCreating] = useState(false);
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  const marqueElRef = useRef();
  const priceElRef = useRef();
  const dateElRef = useRef();
  const descriptionElRef = useRef();

  const context = useContext(AuthContext);

  useEffect(() => {
    fetchCars();
  }, []);

  const startCreateCarHandler = () => {
    if (!context.token) {
      alert('You must be logged in to create a car.');
      return;
    }
    setCreating(true);
  };

  const modalConfirmHandler = () => {
    setCreating(false);
    const marque = marqueElRef.current.value; 
    const price = +priceElRef.current.value;
    const date = dateElRef.current.value;
    const description = descriptionElRef.current.value;

    if (
      marque.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }

    const car = { marque, price, date, description };

    const requestBody = {
      query: `
          mutation {
            createCar(carInput: {marque: "${marque}", description: "${description}", price: ${price}, date: "${date}"}) {
              _id
              marque
              description
              date
              price
            }
          }
        `
    };

    const token = context.token;

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        setCars(prevCars => {
          const updatedCars = [...prevCars];
          updatedCars.push({
            _id: resData.data.createCar._id,
            marque: resData.data.createCar.marque,
            description: resData.data.createCar.description,
            date: resData.data.createCar.date,
            price: resData.data.createCar.price,
            creator: {
              _id: context.userId
            }
          });
          return updatedCars;
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  const modalCancelHandler = () => {
    setCreating(false);
    setSelectedCar(null);
  };

  const fetchCars = () => {
    setIsLoading(true);
    const requestBody = {
      query: `
          query {
            cars {
              _id
              marque
              description
              date
              price
              creator {
                _id
                email
              }
            }
          }
        `
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        const cars = resData.data.cars;
        setCars(cars);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const showDetailHandler = carId => {
    const selectedCar = cars.find(c => c._id === carId);
    setSelectedCar(selectedCar);
  };

  const bookCarHandler = () => {
    if (!context.token) {
      alert('You must be logged in to book a car.');
      return;
    }
    // Proceed with the booking action (not implemented yet)
  };

  return (
    <React.Fragment>
      {(creating || selectedCar) && <Backdrop />}
      {creating && (
        <Modal
          marque="Add Car"
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={modalConfirmHandler}
          confirmText="Confirm"
        >
          <form className="space-y-6">
            <div className="form-control">
              <label htmlFor="marque" className="block text-sm font-medium text-gray-700">
                Marque
              </label>
              <input
                type="text"
                id="marque"
                ref={marqueElRef}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="form-control">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                id="price"
                ref={priceElRef}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="form-control">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="datetime-local"
                id="date"
                ref={dateElRef}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="form-control">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                rows="4"
                ref={descriptionElRef}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </form>
        </Modal>
      )}
      {selectedCar && (
        <Modal
          marque={selectedCar.marque}
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={bookCarHandler}
          confirmText="Book"
        >
          <h1 className="text-2xl font-semibold text-gray-800">{selectedCar.marque}</h1>
          <h2 className="text-lg text-gray-600 mt-2">
            ${selectedCar.price} - {new Date(selectedCar.date).toLocaleDateString()}
          </h2>
          <p className="mt-4 text-gray-700">{selectedCar.description}</p>
        </Modal>
      )}
      {context.token && (
        <div className="mb-8 text-center">
          <p className="text-lg font-semibold text-gray-800">Share your own Cars!</p>
          <button
            className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            onClick={startCreateCarHandler}
          >
            Create Car
          </button>
        </div>
      )}
      {isLoading ? (
        <Spinner />
      ) : (
        <CarList
          cars={cars}
          authUserId={context.userId}
          onViewDetail={showDetailHandler}
        />
      )}
    </React.Fragment>
  );
};

export default CarsPage;
