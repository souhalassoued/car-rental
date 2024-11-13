import React, { Component } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import AuthPage from './pages/Auth';
import BookingsPage from './pages/Bookings';
import CarsPage from './pages/Cars';
import MainNavigation from './components/Navigation/MainNavisation';
import AuthContext from './context/auth-context';

class App extends Component {
  state = {
    token: null,
    userId: null,
    darkMode: false // Add dark mode state
  };

  login = (token, userId, tokenExpiration) => {
    this.setState({ token: token, userId: userId });
  };

  logout = () => {
    this.setState({ token: null, userId: null });
  };

  toggleDarkMode = () => {
    this.setState((prevState) => ({ darkMode: !prevState.darkMode }));
  };

  render() {
    return (
      <BrowserRouter>
        <div className={this.state.darkMode ? 'dark' : ''}> {/* Add dark mode class */}
          <AuthContext.Provider
            value={{
              token: this.state.token,
              userId: this.state.userId,
              login: this.login,
              logout: this.logout
            }}
          >
            <MainNavigation toggleDarkMode={this.toggleDarkMode} isDarkMode={this.state.darkMode} />
            <main className="container mx-auto py-10 px-4 md:px-8">
              <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-6 md:p-10">
                <Routes>
                  {this.state.token && <Route path="/" element={<Navigate to="/cars" replace />} />}
                  {this.state.token && <Route path="/auth" element={<Navigate to="/cars" replace />} />}
                  {!this.state.token && <Route path="/auth" element={<AuthPage />} />}
                  <Route path="/cars" element={<CarsPage />} />
                  {this.state.token && <Route path="/bookings" element={<BookingsPage />} />}
                  {!this.state.token && <Route path="/" element={<Navigate to="/auth" replace />} />}
                </Routes>
              </div>
            </main>
          </AuthContext.Provider>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
