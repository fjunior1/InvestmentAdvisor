import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const history = useHistory();
  return (
    <footer className="w-100 mt-auto bg-secondary p-4">
      <div className="container text-center mb-5">
        {location.pathname !== '/' && (
          <button
            className="btn btn-dark mb-3"
            onClick={() => history.goBack()}
          >
            &larr; Go Back
          </button>
        )}
        <p>
          Developed by the Financial Theorist Group.{' '}
          <span
            className="emoji"
            role="img"
            aria-label="finance"
            aria-hidden="false"
          >
            ❤️
          </span>{' '}
         
        </p>
      </div>
    </footer>
  );
};

export default Footer;
