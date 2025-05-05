import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/login', form);
      alert(`Welcome, ${res.data.user.name}`);
      // Login.js এর handleSubmit এর ভিতরে
localStorage.setItem('user', JSON.stringify(res.data.user));
localStorage.setItem('token', res.data.token);
window.location.href = '/home';
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert('Login failed. Please try again.');
      }
    }
    
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} /><br />
      <input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} /><br />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;