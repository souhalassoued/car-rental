import React, { Component } from 'react';
import Spinner from '../components/Spinner/Spinner';
import AuthContext from '../context/auth-context';
import BookingList from '../components/Bookings/BookingList/BookingList';

class BookingsPage extends Component {
  state = {
    isLoading: false,
    bookings: []
  };

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchBookings();
  }

  fetchBookings = () => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
          query {
            bookings {
              _id
              createdAt
              car {
                _id
                marque
                date
              }
            }
          }
        `
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        const bookings = resData.data.bookings;
        this.setState({ bookings: bookings, isLoading: false });
      })
      .catch(err => {
        console.error('Error fetching bookings:', err);
        this.setState({ isLoading: false });
      });
  };

  deleteBookingHandler = bookingId => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
          mutation {
            cancelBooking(bookingId: "${bookingId}") {
              _id
              marque
            }
          }
        `
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        this.setState(prevState => {
          const updatedBookings = prevState.bookings.filter(booking => booking._id !== bookingId);
          return { bookings: updatedBookings, isLoading: false };
        });
      })
      .catch(err => {
        console.error('Error deleting booking:', err);
        this.setState({ isLoading: false });
      });
  };

  render() {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Bookings</h1>
        {this.state.isLoading ? (
          <div className="flex justify-center items-center w-full h-full">
            <Spinner />
          </div>
        ) : (
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6">
            <BookingList
              bookings={this.state.bookings}
              onDelete={this.deleteBookingHandler}
            />
          </div>
        )}
      </div>
    );
  }
}

export default BookingsPage;
