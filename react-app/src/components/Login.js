import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    if (e.target.name === 'email') {
      setEmail(e.target.value);
    } else if (e.target.name === 'password') {
      setPassword(e.target.value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = {
      email,
      password
    };
   
      
      axios
      .post('http://localhost:3000/api/users/login', userData)
      .then((res) => {
        localStorage.setItem('token', res.data.token);
        console.log(res.data)
        navigate('/profile');
      })
      .catch((err) => {
        setErrors(err.response.data);
      });
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
