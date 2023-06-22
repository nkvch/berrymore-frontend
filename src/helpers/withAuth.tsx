import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { isLoggedOut } from '../recoil/authState';

const authorized = <P extends object>(Component: React.ComponentType<P>) => {
  const AuthorizedComponent: React.FC<P> = (props) => {
    const isloggedout = useRecoilValue(isLoggedOut)

    if (isloggedout) {
      return <Navigate to="/signin" />;
    }

    return <Component {...props} />;
  };

  return AuthorizedComponent;
};

export default authorized;
