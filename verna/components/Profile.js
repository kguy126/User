import React, { useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import axios from 'axios';

const Profile = () => {
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
      // Navigate to the register screen or another screen
    }
  }, []);

  if (!user) {
    return <Text>Loading...</Text>;
  }

  const imageURL = "http://localhost:3000/";
  const avatarData = String.fromCharCode(...user.avatar.data);
  const datahh = imageURL + avatarData;

  return (
    <View>
      <Text>Profile</Text>
      <View>
        <Text>Name: {user.name}</Text>
        <Image source={{ uri: datahh }} style={{ width: 100, height: 100 }} />
      </View>
    </View>
  );
};

export default Profile;
