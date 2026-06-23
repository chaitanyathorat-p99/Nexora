import React from 'react'
import Profile from './profile/Profile'
import { useSelector } from 'react-redux';

const Home = () => {
  const { isAuthenticated, userToken, loading,user} = useSelector(
    (state) => state.user
  );
  return (
    <div>
      <Profile user={user}/>
    </div>
  )
}

export default Home
