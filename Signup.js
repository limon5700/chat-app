import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css';

function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/signup', {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      alert(res.data.message);

      // Save user info and token to localStorage
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('token', res.data.token);

      // Redirect to login page
      window.location.href = '/Login';
    } catch (err) {
      console.error('Signup Error:', err);
      alert(err?.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  // Return the JSX for the signup form
  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2>Sign Up</h2>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit">Sign Up</button>
        <h2>Already have an account?</h2>
      </form>
    </div>
  );
}

export default Signup;
