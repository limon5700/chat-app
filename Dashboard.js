import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/users');
      setUsers(res.data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setUsers([]);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchClick = async () => {
    const value = search.trim();
    if (value === '') return fetchUsers();
  
    // এখানে আমরা শুধু সংখ্যা নয়, স্ট্রিং এবং সংখ্যার মিশ্রণও অনুমোদন করবো
    if (!/^[a-zA-Z0-9]+$/.test(value)) {
      alert("Only alphanumeric IDs (letters and numbers) are allowed.");
      return;
    }
  
    try {
      const res = await axios.get(`http://localhost:5000/users/id/${value}`);  // সার্চের জন্য API কল
      setUsers([res.data] || []);  // সার্চ করা ইউজারটি আনা হবে
    } catch (err) {
      alert('User not found');
      setUsers([]);  // যদি ইউজার না পাওয়া যায়
    }
  };
  

  const toggleStatus = async (id) => {
    try {
      await axios.put(`http://localhost:5000/users/${id}/status`);
      fetchUsers();
    } catch (err) {
      console.error("Status toggle error:", err);
    }
  };

  const handleEdit = (user) => {
    setEditingUser({ ...user });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingUser || !editingUser._id) {
      alert('No user selected for editing');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/users/${editingUser._id}`, {
        name: editingUser.name,
        email: editingUser.email,
        password: editingUser.password,
      });
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  const handleMemberDetailsClick = () => {
    fetchUsers();
  };

  return (
    <div style={{ display: 'flex', fontFamily: 'Arial, sans-serif', height: '100vh', backgroundColor: '#f6f9fc' }}>
      {/* Sidebar */}
      <div style={{
        width: '250px',
        backgroundColor: '#1e2b3b',
        color: 'white',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div>
          <h3 style={{ marginBottom: '30px', borderBottom: '1px solid #3a4b63', paddingBottom: '10px' }}>Dashboard</h3>
          <input
            type="text"
            placeholder="Search by ID"
            value={search}
            onChange={handleSearchChange}
            style={{
              padding: '8px',
              width: '100%',
              marginBottom: '10px',
              border: 'none',
              borderRadius: '4px'
            }}
          />
          <button
            onClick={handleSearchClick}
            style={{
              padding: '8px',
              width: '100%',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Search
          </button>

          <div style={{ marginTop: '40px' }}>
            <p style={{ marginBottom: '10px', fontWeight: 'bold', borderBottom: '1px solid #3a4b63', paddingBottom: '5px' }}>
              Member Management
            </p>
            <ul style={{ listStyle: 'none', paddingLeft: 0, lineHeight: '1.8' }}>
              <li style={{ cursor: 'pointer' }} onClick={handleMemberDetailsClick}>• Member Details</li>
              <li style={{ cursor: 'pointer' }}>• Member Grouping</li>
              <li style={{ cursor: 'pointer' }}>• Member Edit</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flexGrow: 1, padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ marginBottom: '20px' }}>User Management</h2>
          <div style={{ fontWeight: 'bold' }}>
            Logged in as: <span style={{ color: '#2980b9' }}>adminlimon</span>
          </div>
        </div>

        <table style={{
          width: '100%',
          backgroundColor: 'white',
          borderCollapse: 'collapse',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#3498db', color: 'white', textAlign: 'left' }}>
              <th style={{ padding: '10px' }}>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Password</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <React.Fragment key={user._id}>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid #ecf0f1' }}>
                  <td style={{ padding: '10px' }}>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.password}</td>
                  <td>{user.status}</td>
                  <td>
                    <button
                      onClick={() => toggleStatus(user._id)}
                      style={{
                        backgroundColor: user.status === 'active' ? '#e74c3c' : '#2ecc71',
                        color: 'white',
                        padding: '5px 10px',
                        border: 'none',
                        borderRadius: '4px',
                        marginRight: '5px'
                      }}
                    >
                      {user.status === 'active' ? 'Suspend' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleEdit(user)}
                      style={{
                        backgroundColor: '#f1c40f',
                        color: 'black',
                        padding: '5px 10px',
                        border: 'none',
                        borderRadius: '4px'
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>

                {editingUser?._id === user._id && (
                  <tr>
                    <td colSpan="6">
                      <form onSubmit={handleEditSubmit} style={{
                        backgroundColor: '#fefefe',
                        padding: '20px',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                        marginTop: '10px'
                      }}>
                        <h4>Edit User ID: {editingUser._id}</h4>
                        <input
                          type="text"
                          value={editingUser.name}
                          onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                          placeholder="Name"
                          required
                          style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%' }}
                        />
                        <input
                          type="email"
                          value={editingUser.email}
                          onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                          placeholder="Email"
                          required
                          style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%' }}
                        />
                        <input
                          type="password"
                          value={editingUser.password}
                          onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                          placeholder="Password"
                          required
                          style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%' }}
                        />
                        <button type="submit" style={{
                          backgroundColor: '#27ae60',
                          color: 'white',
                          padding: '10px 20px',
                          border: 'none',
                          borderRadius: '4px',
                          width: '100%'
                        }}>
                          Save Changes
                        </button>
                      </form>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
