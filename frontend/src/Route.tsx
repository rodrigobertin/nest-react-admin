import { ComponentType, useContext } from 'react';
import { Navigate as Redirect } from 'react-router-dom';

import { AuthenticationContext } from './context/AuthenticationContext';

export { Route } from 'react-router-dom';

interface PrivateRouteProps {
  component: ComponentType;
  roles?: string[];
}

export function PrivateRoute({ component: Component, roles, ...rest }: PrivateRouteProps) {
  const { authenticatedUser } = useContext(AuthenticationContext);

  if (authenticatedUser) {
    if (roles) {
      if (roles.includes(authenticatedUser.role)) {
        return <Component {...rest} />;
      } else {
        return <Redirect to="/" />;
      }
    } else {
      return <Component {...rest} />;
    }
  } else {
    return <Redirect to="/login" />;
  }
}

export function AuthRoute({ component: Component, ...rest }) {
  const { authenticatedUser } = useContext(AuthenticationContext);
  if (authenticatedUser) {
    return <Redirect to="/" />;
  } else {
    return <Component {...rest} />;
  }
}
