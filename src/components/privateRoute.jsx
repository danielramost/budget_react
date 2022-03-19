import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ authenticated, component: Component, ...rest }) => {
  if (authenticated) {
    return <Route {...rest} render={(props) => <Component {...props} />} />;
  }
  return <Redirect to="/login" />;
}

export default PrivateRoute;