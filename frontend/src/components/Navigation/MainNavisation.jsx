import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaMoon, FaSun } from 'react-icons/fa';
import AuthContext from '../../context/auth-context';

const MainNavigation = ({ toggleDarkMode, isDarkMode }) => (
  <AuthContext.Consumer>
    {context => (
      <header className={`bg-black shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-black'}`}>
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <div className="text-white text-3xl font-bold tracking-wide">
            <h1>My Dream Car</h1>
          </div>
          <nav>
            <ul className="flex space-x-6">
              {!context.token && (
                <li>
                  <NavLink 
                    to="/auth" 
                    className={({ isActive }) =>
                      `transition duration-300 text-white font-semibold px-4 py-2 rounded-md ${isActive ? 'bg-gray-700' : 'hover:bg-gray-800'}`
                    }
                  >
                    Authenticate
                  </NavLink>
                </li>
              )}
              <li>
                <NavLink 
                  to="/cars" 
                  className={({ isActive }) =>
                    `transition duration-300 text-white font-semibold px-4 py-2 rounded-md ${isActive ? 'bg-gray-700' : 'hover:bg-gray-800'}`
                  }
                >
                  Cars
                </NavLink>
              </li>
              {context.token && (
                <>
                  <li>
                    <NavLink 
                      to="/bookings" 
                      className={({ isActive }) =>
                        `transition duration-300 text-white font-semibold px-4 py-2 rounded-md ${isActive ? 'bg-gray-700' : 'hover:bg-gray-800'}`
                      }
                    >
                      Bookings
                    </NavLink>
                  </li>
                  <li>
                    <button
                      onClick={context.logout}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-md transition-transform duration-200 transform hover:scale-105"
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </nav>
          <button onClick={toggleDarkMode} className="text-white p-2">
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </header>
    )}
  </AuthContext.Consumer>
);

export default MainNavigation;
