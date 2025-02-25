import React from 'react';
import './profile.component.css';
import avatarImage from '../assets/avatar.png';

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';


const Profile = () => {
  const navigate = useNavigate();

  const handleEditInformation = () => {
    navigate('/dashboard');
  };

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

    return (
      <div className="profile-container">
        <div className='profile-header'>
          <img src={avatarImage} alt="Profile Avatar" className='avatar'/>
          <div className='profile-text-content'>
           <h1 className='custom-h1'> Hello Name </h1>
            <h1 className='custom-h1'>Email Address: example@gmail.com </h1>
          
            <button onClick={handleEditInformation} className='edit-information-button-style'>Edit information</button>
          </div>
        </div>

        <div className="info-container">
          <div className="form-group">
            <label htmlFor='monthly income'>What is your monthly income? :</label>
            <input type="text" id="monthly income" name="monthly income" placeholder="$" />
          </div>
        </div>

        <div className="info-container">
          <div className="form-group">
            <label htmlFor='monthly spending goal'>What is your ideal monthly spending goal? :</label>
            <input type="text" id="monthly spending goal" name="monthly spending goal" placeholder="$" />
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
         
      </div>
    );
  }
  
  export default Profile;