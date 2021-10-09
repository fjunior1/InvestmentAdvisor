// Node Modules
import React, { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { UPDATE_PREFS } from '../utils/mutations';

// Utilities
import Auth from '../utils/auth';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
const Preferences = (props) => {
  const { id } = useParams();
  const [formState, setFormState] = useState({})
  const [updatePrefs, err] = useMutation(UPDATE_PREFS);
  // Get current user
  const { loading, data, error } = useQuery(id ? QUERY_USER : QUERY_ME, {
    variables: { id },
  });

  const user = data?.me || data?.user || {};
  
  useEffect(() => {
    if (user && !loading) {
      const {name, username, password, lastName, email, address, phone, ...tmp } = user;
      setFormState(tmp);
     }
  },[user, loading])
  if (err) console.log(err);
  if (error) console.log(error);

  // redirect to personal profile page if username is yours
  if (Auth.loggedIn() && Auth.getProfile().data._id === id) {
    return <Redirect to="/me" />;
  }

  if (loading) {
    return <h4>Loading...</h4>;
  }

  if (!user?.username) {
    return (
      <h4>
        You need to be logged in to see this. Use the navigation links above to
        sign up or log in!
      </h4>
    );
  }
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(formState);
      /* const { data } =*/ await updatePrefs({
        variables: {
          income:formState.income,
          age:formState.age,
          risk:formState.risk
         },
      });

      // Auth.login(data.login.token);
    } catch (e) {
      console.error("error calling update from preferences" + e);
    }
  };
  const renderCurrentUserInfo = () => {
    if (id) return null;
    return (

      <form onSubmit={handleFormSubmit}>

{/* age  */}
        Age:<select className="form-input" name="age"
          onChange={handleChange}>
          <option value="18-24"> 18-24</option>
          <option value="25-29">25-29</option>
          <option value="30-34">30-34</option>
          <option value="35-39">35-39</option>
          <option value="40-44">40-44</option>
          <option value="45-49">45-49</option>
          <option value="50-54">50-54</option>
          <option value="55-59">55-59</option>
          <option value="60+">60+</option>
        </select>

      {/* income */}
       Income: <select className="form-input" name="income"
          onChange={handleChange}>
          <option value="<30k">&lt;30k</option>
          <option value="30k-49k" >30k-49k</option>
          <option value="50k-69k" >50k-69k</option>
          <option value="70k-89k" >70k-89k</option>
          <option value="90k-109k">90k-109k</option>
        </select>      

        {/* risk  */}
       Risk: <select className="form-input" name="risk"
                  onChange={handleChange}>
                   <option value="minimum">minimum</option>
                  <option value="low">low</option>
                  <option value="medium">medium</option>
                  <option value="high">high</option>
                  <option value="maximum">maximum</option>
                </select>
{/* cursor : 'pointer' */}
        <button
          className="btn btn-block btn-primary"
         
          type="submit"
          
        >
          Update
        </button>
      </form>
    );
  }


  return (
    <div>
      <div className="flex-row justify-center mb-3">
        <h2 className="col-12 col-md-10 bg-header text-light p-3 mb-5">
          Viewing {user.username ? `${user.username}'s` : 'your'} profile.
        </h2>
        {renderCurrentUserInfo()}
      </div>
    </div>
  );
};

export default Preferences;