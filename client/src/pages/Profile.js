// Node Modules
import React, { useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { UPDATE_USER } from '../utils/mutations';
// Utilities
import Auth from '../utils/auth';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
// Components
//import UserList from '../components/UserList';

const Profile = (props) => {
  const { id } = useParams();


  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    lastName: '',
    address: '',
    phone: '',
    income: '',
    age: '',
    risk: ''
  })

  // Get current user
  const { loading, data, error } = useQuery(id ? QUERY_USER : QUERY_ME, {
    variables: { id },
  });

  // Get a list of all users
  // const { usersLoading, data: usersData } = useQuery(QUERY_USERS);

  const user = data?.me || data?.user || {};
  // const users = usersData?.users || [];

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
    // const [updateUser, { error, data }] = useMutation(UPDATE_USER);
    try {
      // console.log(formState);
      // const { data } = await updateUser({
      //   variables: { ...formState },
      // });

      //FDIAZ NOTE this logs the user in automatically, we dont need this 
      // Auth.login(data.addUser.token);

    } catch (e) {
      console.error(e);
    }
  };

  const renderCurrentUserInfo = () => {
    if (id) return null;
    return (

      // FD test form here

      <form onSubmit={handleFormSubmit}>
        <input
          className="form-input bg-lightgray"
          placeholder="Your username"
          name="username"
          type="text"
          value={user.username}  // FDIAZ: should this be username ????
          onChange={handleChange}
          readonly
          
        />
        <input
          className="form-input bg-lightgray"
          placeholder="Your email"
          name="email"
          type="email"
          value={user.email}
          onChange={handleChange}
        />
        <input
          className="form-input"
          placeholder="Password"
          name="password"
          type="password"
          value={user.password}
          onChange={handleChange}
        />

        <input
          className="form-input"
          placeholder="Name"
          name="name"
          type="text"
          value={user.name}  // FDIAZ: this is the name, not the username
          onChange={handleChange}
        />
        <input
          className="form-input"
          placeholder="last name"
          name="lastName"
          type="string"
          value={user.lastName}
          onChange={handleChange}
        />
        <input
          className="form-input"
          placeholder="Address"
          name="address"
          type="string"
          value={user.address}
          onChange={handleChange}
        />
        <input
          className="form-input"
          placeholder="Phone"
          name="phone"
          type="string"   //FDIAZ: string to make it simple
          value={user.phone}
          onChange={handleChange}
        />

        {/* <select class="form-input" name="income"
          onChange={handleChange}>
          <option value="<30k">&lt;30k</option>
          <option value="30k-49k" >30k-49k</option>
          <option value="50k-69k" >50k-69k</option>
          <option value="70k-89k" >70k-89k</option>
          <option value="90k-109k">90k-109k</option>
        </select> */}

        {/* <select class="form-input" name="age"
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
        </select> */}

        {/* <input
          className="form-input"
          placeholder="Risk"
          name="risk"
          list="risks"
          type="string"
          value={user.risk}
          onChange={handleChange}
        />
        <datalist id="risks">
          <option value="minimum" />
          <option value="low" />
          <option value="medium" />
          <option value="high" />
          <option value="maximum" />
        </datalist> */}

        <button
          className="btn btn-block btn-primary"
          style={{ cursor: 'pointer' }}
          type="submit"
        >
          Update
        </button>
      </form>
      // FD end test form 

    );
  }

  return (
    <div>
      <div className="flex-row justify-center mb-3">
        <h2 className="col-12 col-md-10 bg-header text-light p-3 mb-5">
          Viewing {id ? `${user.username}'s` : 'your'} profile.
        </h2>
        {renderCurrentUserInfo()}
      </div>
    </div>
  );
};

export default Profile;
