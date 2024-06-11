// src/Profile.js
import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/userContext.js';
import './Profile.css';
import axios from "axios";
const Profile = () => {
  //initializing variables
  const { user, setUser } = useUser();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(user);
  const [newImage, setNewImage] = useState(null);

  const [error, setError] = useState(null);

  //storing input in formData variable
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //handling specially user loaded image
  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

 //loading image in base64 formate 
  const handleSave = async () => {
    let updatedData = formData;

    if (newImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatedData = { ...updatedData, image: reader.result };
       
         //sending request for saving the changes in user profile on backend
        sendUpdateRequest(updatedData);
      };
      reader.readAsDataURL(newImage);
    } else {
       //sending request for saving the changes in user profile on backend
      sendUpdateRequest(updatedData);
    }
  };
//function for backend request.
  const sendUpdateRequest = async (data) => {
    try {
      const response = await axios.put(`/update/${user._id}`, data)
      console.log(response);
      if (response.status == 200) {
        const updatedUser = response.data;
        setUser(updatedUser);
        setFormData(updatedUser);
        setEditMode(false);
        setNewImage(null);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
//handling canel changes case
  const handleCancel = () => {
    setFormData(user);
    setEditMode(false);
    setNewImage(null);
  };


  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src={formData.image ? formData.image : ""} alt="User" className="profile-image" />
        <button onClick={() => setEditMode(!editMode)} className="edit-button">
          {editMode ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {editMode ? (
        <div className="profile-form">
          <div className="form-group">
            <label htmlFor="profileImage">Profile Image:</label>
            <input type="file" id="profileImage" placeholder='limit 50mb' onChange={handleImageChange} />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
          <button onClick={handleSave} className="save-button">Save</button>
          {error && <h4>{error}</h4>}
          <button onClick={handleCancel} className="cancel-button">Cancel</button>
        </div>
      ) : (
        <div className="profile-details">
          <h2>{user.username}</h2>
          <p>Email: {user.email}</p>
          <p>{user.description}</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
