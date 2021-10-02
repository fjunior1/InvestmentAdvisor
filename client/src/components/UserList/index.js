import React from 'react';
import { Link } from 'react-router-dom';
import { Doughnut} from 'react-chartjs-2';

const User = ({ _id, username }) => {
  return (
    <div key={_id} className="card mb-3">
      <h4 className="card-header bg-dark text-light p-2 m-0">
        <Link className="text-light" to={`/users/${_id}`}>
          {username}
        </Link>
      </h4>
    </div>
  );
};

const data = {
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
const UserList = ({ users, title }) => {
  
  /* This <div> <a> can be used to add a link th react charts github page
      <div className='links'>
        <a
          className='btn btn-gh'
          href='https://github.com/reactchartjs/react-chartjs-2/blob/master/example/src/charts/Doughnut.js'
        >
          Github Source
        </a>
      </div>
  */
  return (
    <>
      <h3>You future is safe with our help</h3>
      <div className='header'>
      </div>
      <br></br>
      <br></br>
      <br></br>
      <h1 className='title'>Budget</h1>
      <Doughnut data={data} options={options} />

    </>  
   );       
};

export default UserList; // FDIAZ change name to reflect it is a graph sample
