import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
  
    if (token) {
      axios.defaults.headers.common['Authorization'] = token;

      axios
        .get('http://localhost:3000/api/users/current')
        .then((res) => {
          console.log('Response:', res.data);
          setUser(res.data);
        })
        .catch((err) => {
          console.log('Error:', err);
        });
    } else {
      navigate('/register');
    }
  }, [navigate]);
  

  if (!user) {
    return <div>Loading...</div>;
  }

  const imageURL = "http://localhost:3000/";
  const avatarData = String.fromCharCode(...user.avatar.data);
  const datahh= imageURL +avatarData;


  return (
    <div>
      <h1>Profile</h1>
      <div>
        <h2>Name: {user.name}</h2>
        <img src={datahh} alt="Profile Avatar" />
      </div>
    </div>
  );
};

export default Profile;
