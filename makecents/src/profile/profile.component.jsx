import React from 'react';
import './profile.component.css';
import avatarImage from '../assets/avatar.png';

import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';


const Profile = () => {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false); // for the edit information button
  const [userData, setUserData] = useState({ username: '', password: ' ', email: '', monthlyIncome: '', spendingGoal: '' });

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  // Same as the create account page which is being edited for update to backend
  // Spending categories and news topics
  const categories = ['Groceries', 'Rent', 'Subscriptions', 'Fitness', 'Eating out', 'Transportation'];
  const newsTopics = ['Stock Market', 'Interest Rates', 'Technology', 'Politics', 'Currency Rates'];

  // Handle category selection toggle
  // category represents the specific category that is being clicked
  const toggleCategory = (category) => {
    // to be able to select and unselect a category, we have to save the prev array
      setSelectedCategories((prev) =>
      // if the category is already selected, unselect it
      // if the category is not selected, select it
          prev.includes(category) ? prev.filter((item) => item !== category) : [...prev, category]
          
      );
  };


  // Handle news topic selection toggle
  // news topic represents the specific news topic that is being clicked
  const toggleNewsTopic = (newsTopic) => {
    // to be able to select and unselect a news topic, we have to save the prev array
    setSelectedTopics((prev) =>
      // if the news topic is already selected, unselect it
      // if the news topic is not selected, select it
          prev.includes(newsTopic) ? prev.filter((item) => item !== newsTopic) : [...prev, newsTopic]
          
      );
  };


  useEffect(() => {
    // display the user name and email
    const userEmail = localStorage.getItem('userEmail');

    if (userEmail) {
      fetch(`http://localhost:8080/profile/${userEmail}`)
      .then(response => response.json())
      .then(data => {
        setUserData({
          username: data.username,
          email: data.email,
          monthlyIncome: data.monthlyIncome || 0,
          spendingGoal: data.spendingGoal || 0,
        });
        setSelectedCategories(data.selectedCategories || []);
        setSelectedTopics(data.selectedTopics || []);
      })

      .catch(error => console.error("Error fetching user data:", error));

  } else {
    navigate('/login'); 
  }

  }, []);



  const handleEditInformation = () => {
    setIsEditing(true);
  };

  const handleSavedInfo = async () => {
    const userEmail = localStorage.getItem('userEmail');
    const userPassword = localStorage.getItem('userPassword');
    const userName = userData.username;
    console.log("Username: ", userName);
    console.log("Password: ", userPassword);
    console.log("Email being fetched: ", userEmail);
  
    if (!userEmail) {
      console.error("Error: userEmail is null or undefined.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8080/profile/${userEmail}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: userName,
          password: userPassword,
          monthlyIncome: Number(userData.monthlyIncome),
          spendingGoal: Number(userData.spendingGoal),
          selectedCategories,
          selectedTopics,
        }),
      });
      console.log("Sending data:", JSON.stringify({
        username: userName,
        monthlyIncome: userData.monthlyIncome || 0,
        spendingGoal: userData.spendingGoal || 0,
        selectedCategories: selectedCategories || [],
        selectedTopics: selectedTopics || [],
      }));
  
      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.status}`);
      }
  
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  
  
  const handleDashboard = () => {
    navigate('/dashboard'); 
  };

  const handleLogin = () => {
    navigate('/login');
  }
  

    return (
      <div className="profile-container">
        <button onClick={handleLogin} className='sign-out-button'>Sign out</button>
        <div className='profile-header'>
          <img src={avatarImage} alt="Profile Avatar" className='avatar'/>
          <div className='profile-text-content'>
           <h1 className='custom-h1-profile'> Hello {userData.username} </h1>
            <h1 className='custom-h1-profile'>Email Address: {userData.email} </h1>
          
            <button onClick={handleEditInformation} className='edit-information-button-style'>Edit information</button>
          </div>
        </div>
        <div className={`profile-container-box ${isEditing ? 'enabled' : 'disabled'}`}>
        <div className="info-container">
          <div className="form-group">
            <label className="label-profile" htmlFor='monthly income'>What is your monthly income? :</label>
            <input className="input-profile" type="number" id="monthly income" name="monthly income" placeholder="$" value={userData.monthlyIncome} onChange={(e) => setUserData({ ...userData, monthlyIncome: e.target.value })}/>
          </div>
        </div>

        <div className="info-container">
          <div className="form-group">
            <label className="label-profile" htmlFor='monthly spending goal'>What is your ideal monthly spending goal? :</label>
            <input className="input-profile" type="number" id="monthly spending goal" name="monthly spending goal" placeholder="$" value={userData.spendingGoal} onChange={(e) => setUserData({ ...userData, spendingGoal: e.target.value })}/>
          </div>
        </div>

        <div className="info-container">
         <label htmlFor='categories'>What spending categories do you want to focus on? :</label>
            <div className="selection-boxes">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`selection-box ${selectedCategories.includes(category) ? 'selected' : ''}`}
                  onClick={() => toggleCategory(category)}
                  > {category}
                </button>
              ))}
            </div>
         </div>


         <div className="info-container">
         <label htmlFor='newstopics'>What news topics most interest you to stay up to date? :</label>
            <div className="selection-boxes">
              {newsTopics.map((newsTopic) => (
                <button
                  key={newsTopic}
                  className={`selection-box ${selectedTopics.includes(newsTopic) ? 'selected' : ''}`}
                  onClick={() => toggleNewsTopic(newsTopic)}
                  > {newsTopic}
                </button>
              ))}
            </div>
         </div>

         <button onClick={handleSavedInfo} className='saved-button'>Save</button>
         </div>
         <button onClick={handleDashboard} className='dashboard-button'>Return to Dashboard</button>
         {/* <footer className="profile-footer"></footer> */}
      </div>
    );
  }
  
  export default Profile;