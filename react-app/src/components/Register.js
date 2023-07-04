import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    if (e.target.name === 'name') {
      setName(e.target.value);
    } else if (e.target.name === 'email') {
      setEmail(e.target.value);
    } else if (e.target.name === 'password') {
      setPassword(e.target.value);
    } else if (e.target.name === 'password2') {
      setConfirmPassword(e.target.value);
    } else if (e.target.name === 'avatar') {
      setAvatar(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = new FormData();
    userData.append('name', name);
    userData.append('email', email);
    userData.append('password', password);
    userData.append('password2', password2);
    userData.append('avatar', avatar);

      
      axios.post('http://localhost:3000/api/users/register', userData)
      .then((res) => {
        navigate('/');
      })
      .catch((err) => {
        setErrors(err.response.data);
      });
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={name} onChange={handleInputChange} />
          {errors.name && <div>{errors.name}</div>}
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={email} onChange={handleInputChange} />
          {errors.email && <div>{errors.email}</div>}
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={password} onChange={handleInputChange} />
          {errors.password && <div>{errors.password}</div>}
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            name="password2"
            value={password2}
            onChange={handleInputChange}
          />
          {errors.password2 && <div>{errors.password2}</div>}
        </div>
        <div>
          <label>Avatar:</label>
          <input type="file" name="avatar" accept="image/*" onChange={handleInputChange} />
          {errors.avatar && <div>{errors.avatar}</div>}
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
