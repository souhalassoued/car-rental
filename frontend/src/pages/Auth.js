import React, { Component } from 'react';
import AuthContext from '../context/auth-context'; 
import carImage from '../assets/car1.avif';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

class AuthPage extends Component {
  state = {
    isLogin: true,
    showPassword: false,
    errors: {
      email: '',
      password: '',
      terms: '',
      auth: ''
    },
    acceptTerms: false
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  switchModeHandler = () => {
    this.setState(prevState => ({
      isLogin: !prevState.isLogin,
      errors: {}  // Clear errors on mode switch
    }));
  };

  togglePasswordVisibility = () => {
    this.setState(prevState => ({
      showPassword: !prevState.showPassword
    }));
  };

  handleTermsChange = (event) => {
    this.setState({ acceptTerms: event.target.checked });
  };

  submitHandler = (event) => {
    event.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;
    let errors = { email: '', password: '', terms: '', auth: '' };

    // Validation
    if (email.trim().length === 0) errors.email = 'Email is required.';
    if (password.trim().length === 0) errors.password = 'Password is required.';
    if (!this.state.acceptTerms) errors.terms = 'You must accept the Terms of Use & Privacy Policy.';

    if (errors.email || errors.password || errors.terms) {
      this.setState({ errors });
      return;
    }

    let requestBody = {
      query: `
        query {
          login(email: "${email}", password: "${password}") {
            userId
            token
            tokenExpiration
          }
        }
      `
    };

    if (!this.state.isLogin) {
      requestBody = {
        query: `
          mutation {
            createUser(userInput: {email: "${email}", password: "${password}"}) {
              _id
              email
            }
          }
        `
      };
    }

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
        if (resData.data.login?.token) {
          this.context.login(
            resData.data.login.token,
            resData.data.login.userId,
            resData.data.login.tokenExpiration
          );
        } else if (resData.errors) {
          this.setState({ errors: { auth: 'Incorrect email or password.' } });
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({ errors: { auth: 'An error occurred. Please try again.' } });
      });
  };

  render() {
    const { showPassword, errors, acceptTerms } = this.state;

    return (
      <div
        className="flex items-center justify-center min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: `url(${carImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="bg-white bg-opacity-80 p-8 max-w-md w-full rounded-xl shadow-lg backdrop-blur-sm">
          <h2 className="text-3xl text-center text-gray-900 mb-4">
            {this.state.isLogin ? 'Login' : 'Register'}
          </h2>
          <p className="text-center mb-6 text-gray-700">
            {this.state.isLogin ? 'Login to your account.' : 'Create your account. It’s free!'}
          </p>

          <form onSubmit={this.submitHandler} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                ref={this.emailEl}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                ref={this.passwordEl}
              />
              <span
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                onClick={this.togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
            {!this.state.isLogin && (
              <div>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            )}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={this.handleTermsChange}
                className="h-5 w-5"
              />
              <span className="text-sm text-gray-600">
                I accept the{' '}
                <button className="text-purple-500 font-semibold" type="button">
                  Terms of Use
                </button>{' '}
                &{' '}
                <button className="text-purple-500 font-semibold" type="button">
                  Privacy Policy
                </button>
              </span>
            </div>
            {errors.terms && <p className="text-red-500 text-sm">{errors.terms}</p>}
            <div>
              <button
                type="submit"
                className="w-full py-3 bg-purple-500 text-white rounded-md transition-transform duration-200 transform hover:scale-105"
              >
                {this.state.isLogin ? 'Login' : 'Register Now'}
              </button>
            </div>
          </form>

          {errors.auth && <p className="text-red-500 text-center mt-4">{errors.auth}</p>}

          <div className="mt-5 text-center text-sm text-gray-600">
            <span>
              {this.state.isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={this.switchModeHandler}
                className="text-purple-500 font-semibold hover:underline"
              >
                {this.state.isLogin ? 'Register' : 'Login'}
              </button>
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default AuthPage;
