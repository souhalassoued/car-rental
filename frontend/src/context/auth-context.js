import React from 'react';

export default React.createContext({
    token: null,
    userId: null,
    login: (token, userId, tokenExpiration) => {},
    logout: () => { this.setState({ token: null, userId: null });
    window.location.href = '/';}
});