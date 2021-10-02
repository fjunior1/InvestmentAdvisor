// Node Modules
import React from 'react';
import { useQuery } from '@apollo/client';
// Utilities
import Auth from '../utils/auth';
import { QUERY_USERS } from '../utils/queries';
// Components
import UserList from '../components/UserList';

const Home = () => {
  const { loading, data } = useQuery(QUERY_USERS);
  const users = data?.users || [];

  const renderUserList = () => {
    if (loading) {
      return <h2>Loading...</h2>
    } else {
      if (!Auth.loggedIn()) {
        // home page with no ser logged in
        return <UserList users={users} title="Client List" />
      } else {
        // have to redirect to profile pagfe of user
        return <UserList users={users} title="Client List" />
      }
      //
    }
  } 

  const renderUsername = () => {
    if (!Auth.loggedIn()) return null;
    return Auth.getProfile().data.username;
  }

  return (
    <main>
      <div className="flex-row justify-center">
        <div
          className="col-12 col-md-10 mb-3 p-3"
         // style={{ border: '1px dotted #1a1a1a' }}
        >
         {renderUsername()}
        </div>
        <div className="col-12 col-md-8 mb-3">
          {renderUserList()}
        </div>
      </div>
    </main>
  );
};

export default Home;
