import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [errors, setErrors] = useState({});

  const handleInputChange = (name, value) => {
    if (name === 'name') {
      setName(value);
    } else if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    } else if (name === 'password2') {
      setConfirmPassword(value);
    } else if (name === 'avatar') {
      setAvatar(value);
    }
  };

  const handleSubmit = () => {
    const userData = new FormData();
    userData.append('name', name);
    userData.append('email', email);
    userData.append('password', password);
    userData.append('password2', password2);
    userData.append('avatar', avatar);

    axios
      .post('http://localhost:3000/api/users/register', userData)
      .then((res) => {
        // Handle successful registration
      })
      .catch((err) => {
        setErrors(err.response.data);
      });
  };

  return (
    <View>
      <Text>Register</Text>
      <View>
        <Text>Name:</Text>
        <TextInput
          style={{ borderWidth: 1, borderColor: 'gray' }}
          value={name}
          onChangeText={(value) => handleInputChange('name', value)}
        />
        {errors.name && <Text>{errors.name}</Text>}
      </View>
      <View>
        <Text>Email:</Text>
        <TextInput
          style={{ borderWidth: 1, borderColor: 'gray' }}
          value={email}
          onChangeText={(value) => handleInputChange('email', value)}
        />
        {errors.email && <Text>{errors.email}</Text>}
      </View>
      <View>
        <Text>Password:</Text>
        <TextInput
          style={{ borderWidth: 1, borderColor: 'gray' }}
          secureTextEntry={true}
          value={password}
          onChangeText={(value) => handleInputChange('password', value)}
        />
        {errors.password && <Text>{errors.password}</Text>}
      </View>
      <View>
        <Text>Confirm Password:</Text>
        <TextInput
          style={{ borderWidth: 1, borderColor: 'gray' }}
          secureTextEntry={true}
          value={password2}
          onChangeText={(value) => handleInputChange('password2', value)}
        />
        {errors.password2 && <Text>{errors.password2}</Text>}
      </View>
      <View>
        <Text>Avatar:</Text>
        {/* File upload component for selecting avatar */}
      </View>
      {errors.avatar && <Text>{errors.avatar}</Text>}
      <Button title="Register" onPress={handleSubmit} />
    </View>
  );
};

export default Register;
