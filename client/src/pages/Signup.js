import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';

//import Auth from '../utils/auth';

const Signup = () => {
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
  });
  const [addUser, { error, data }] = useMutation(ADD_USER);

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
      /*const { data } =*/ await addUser({
        variables: { ...formState },
      });

      //FDIAZ NOTE this logs the user in automatically, we dont need this 
      // Auth.login(data.addUser.token);

    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="flex-row justify-center mb-4">
      <div className="col-12 col-lg-10">
        <div className="card">
          <h4 className="card-header bg-dark text-light p-2">Sign Up</h4>
          <div className="card-body">
            {data ? (
              <p>
                Success! You may now head{' '}
                <Link to="/">back to the homepage.</Link>
              </p>
            ) : (

              <form onSubmit={handleFormSubmit}>
                <input
                  className="form-input"
                  placeholder="Your username"
                  name="username"
                  type="text"
                  value={formState.username}  // FDIAZ: should this be username ????
                  onChange={handleChange}
                />
                <input
                  className="form-input"
                  placeholder="Your email"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={handleChange}
                />
                <input
                  className="form-input"
                  placeholder="Password"
                  name="password"
                  type="password"
                  value={formState.password}
                  onChange={handleChange}
                />

                <input
                  className="form-input"
                  placeholder="Name"
                  name="name"
                  type="text"
                  value={formState.name}  // FDIAZ: this is the name, not the username
                  onChange={handleChange}
                />
                <input
                  className="form-input"
                  placeholder="last name"
                  name="lastName"
                  type="string"
                  value={formState.lastName}
                  onChange={handleChange}
                />
                <input
                  className="form-input"
                  placeholder="Address"
                  name="address"
                  type="string"
                  value={formState.address}
                  onChange={handleChange}
                />
                <input
                  className="form-input"
                  placeholder="Phone"
                  name="phone"
                  type="string"   //FDIAZ: string to make it simple
                  value={formState.phone}
                  onChange={handleChange}
                />

                Income: <select class="form-input" name="income"
                  onChange={handleChange}>
                  <option value="<30k">&lt;30k</option>
                  <option value="30k-49k" >30k-49k</option>
                  <option value="50k-69k" >50k-69k</option>
                  <option value="70k-89k" >70k-89k</option>
                  <option value="90k-109k">90k-109k</option>
                </select>
                  
                  <select class="form-input" name="age"
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

                <input
                  className="form-input"
                  placeholder="Risk"
                  name="risk"
                  list="risks"
                  type="string"
                  value={formState.risk}
                  onChange={handleChange}
                />
                <datalist id="risks">
                  <option value="minimum" />
                  <option value="low" />
                  <option value="medium" />
                  <option value="high" />
                  <option value="maximum" />
                </datalist>
                <button
                  className="btn btn-block btn-primary"
                  style={{ cursor: 'pointer' }}
                  type="submit"
                >
                  Submit
                </button>
              </form>
            )}

            {error && (
              <div className="my-3 p-3 bg-danger text-white">
                {error.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Signup;
