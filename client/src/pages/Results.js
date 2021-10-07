// Node Modules
import React, { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { UPDATE_PREFS } from '../utils/mutations';
import { Doughnut, Line } from 'react-chartjs-2';

// Utilities
import Auth from '../utils/auth';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
const Results = (props) => {
    let userName;
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
      console.log(tmp);
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
  else {
      userName = user.username;
    }

// do calculations here

const values = {
    labels: ['Food', 'Housing', 'Healthcare', 'savings', 'Leisure', 'Other'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const options = {
  
  };

    
    // line chart input

    const lineData = {
        labels: ['1', '2', '3', '4', '5', '6'],
        datasets: [
          {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            fill: false,
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgba(255, 99, 132, 0.2)',
          },
        ],
      };
      
      const lineOptions = {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      };











// update if changes to income, age or risk
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    
        
          // reset form values
      if(user !== undefined){
          console.log(formState);
          console.log(user.income);
            setFormState({
              ...formState,
                income: user.income,
                age: user.age,
                risk: user.risk
            });
      }

      
  };
  const renderCurrentUserInfo = () => {
    if (id) return null;
    return (

      <form onSubmit={handleFormSubmit}>

{/* age  */}
        Age:<select value={formState.age} class="form-input" name="age" id="age"
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
       Income: <select value={formState.income} class="form-input" name="income"
          onChange={handleChange}>
          <option value="<30k">&lt;30k</option>
          <option value="30k-49k" >30k-49k</option>
          <option value="50k-69k" >50k-69k</option>
          <option value="70k-89k" >70k-89k</option>
          <option value="90k-109k">90k-109k</option>
        </select>      

        {/* risk  */}
       Risk: <select value={formState.risk} class="form-input" name="risk"
                  onChange={handleChange}>
                   <option value="minimum">minimum</option>
                  <option value="low">low</option>
                  <option value="medium">medium</option>
                  <option value="high">high</option>
                  <option value="maximum">maximum</option>
                </select>

        <button
          className="btn btn-block btn-primary"
          style={{ cursor: 'pointer' }}
          type="submit"
        >
          Reset to user values
        </button>
      </form>
    );
  }
  return (
    <div>
      <div className="flex-row justify-center mb-3">
        <h2 className="col-12 col-md-10 bg-header text-light p-3 mb-5">
          Viewing {userName ? `${userName}'s` : 'your'} analysis results.
        </h2>
              {renderCurrentUserInfo()}
              <Doughnut data={values} options={options} />   
              <Line data={lineData} options={lineOptions} />

      </div>
    </div>
  );
};

export default Results;