import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import Auth from '../../utils/auth';

const Header = () => {
  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };

  function ButtonColors(page) {
    //const location = useLocation();
    const nowPath = /*location*/useLocation().pathname.substring(1);

    if (page === nowPath) {
      return "btn btn-lg  m-2 btn-light";
    } else {
      return "btn btn-lg  m-2 btn-info";
    }
  }

  const renderControls = () => {
    // If logged in show logout controls
    if (Auth.loggedIn()) {
      // get page to 
      //{/* "btn btn-lg btn-info {} m-2" */}
      return (
        <>
          <Link id="me" className={ButtonColors("me") } to="/me">
            {Auth.getProfile().data.username}'s profile
          </Link>
          <Link id="preferences" className={ButtonColors("preferences") } to="/preferences">
             Preferences 
          </Link>
          <Link id="results" className={ButtonColors("results") } to="/results">
            Results
          </Link>
          <button className="btn btn-lg btn-info m-2" onClick={logout}>
            Logout
          </button>
        </>
      );
    }
    // If logged out show login controls
    return (
      <>
        <Link className="btn btn-lg btn-info m-2" to="/login">
          Login
        </Link>
        <Link className="btn btn-lg btn-light m-2" to="/signup">
          Signup
        </Link>
      </>
    )
  };

  return (
    /*changed bg-dark to bg-hreader to use a lighter color*/
    <header className="bg-header text-light mb-4 py-3 flex-row align-center">
      <div className="container flex-row justify-space-between-lg justify-center align-center">
        <div>
          <Link className="text-light" to="/">
            <h1 className="m-0">Investment Advisor Application</h1>
          </Link>
        </div>
        <div>
          <p className="m-0 text-center">Let your investments work for you.</p>
          {renderControls()}
        </div>
      </div>
    </header>
  );
};

export default Header;
