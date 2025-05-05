import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setName(parsed.name);
      setEmail(parsed.email);
      
      setProfileImage(parsed.profileImage || '/default-profile.png');
    } else {
      navigate('/login');
    }
  }, [navigate]);


  const handleSave = async () => {
    const updatedUser = { ...user, name, email, profileImage };
  
    try {
      await axios.put(`http://localhost:5000/update-user/${user.id}`, updatedUser);
      // Update localStorage after successful database update
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update user:', err);
      alert('Failed to update profile');
    }
  };
  

  // Handle profile picture change
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

//   // Save profile updates
//   const handleSave = () => {
//     const updatedUser = { ...user, name, email, profileImage };
//     localStorage.setItem('user', JSON.stringify(updatedUser));
//     setEditMode(false); // Exit edit mode
//   };

  // Cancel editing and reset to original user data
  const handleCancel = () => {
    setName(user.name);
    setEmail(user.email);
    setProfileImage(user.profileImage || '/default-profile.png');
    setEditMode(false);
  };

  // Handle close profile page
  const handleCloseProfile = () => {
    navigate('/Home'); // Navigate back to home
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <button className="close-btn" onClick={handleCloseProfile}>×</button>
        <h2>Your Profile</h2>
      </div>

      <div className="profile-info">
        <div className="profile-img-container">
          <img
            src={profileImage}
            alt="Profile"
            className="profile-img"
          />
          {editMode && (
            <input
              type="file"
              accept="image/*"
              className="file-input"
              onChange={handleProfilePicChange}
            />
          )}
        </div>

        <div className="profile-data">
          <label>Name:</label>
          {editMode ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          ) : (
            <p>{name}</p>
          )}

          <label>Email:</label>
          {editMode ? (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          ) : (
            <p>{email}</p>
          )}

          {/* Displaying User ID */}
          <label>User ID:</label>
          <p>{user.id}</p> {/* Displaying the user ID here */}
        </div>

        <div className="profile-buttons">
          {editMode ? (
            <>
              <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
              <button className="save-btn" onClick={handleSave}>Save</button>
            </>
          ) : (
            <button className="edit-btn" onClick={() => setEditMode(true)}>Edit Profile</button>
          )}
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
