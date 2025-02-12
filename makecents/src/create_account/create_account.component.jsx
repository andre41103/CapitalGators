import React from 'react';
import { useNavigate } from 'react-router-dom';
import './create_account.component.css';
import { useState } from 'react';


const Create_Account = () => {
    // useNavigate hook to navigate programmatically
    const navigate = useNavigate();

    // Handle login logic
    const handleLogin = () => {
        navigate('/login');
 
    };

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedTopics, setSelectedTopics] = useState([]);

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



    return (
        <div className="content">
          <h1 className='custom-h1'>Welcome to MakeCents!</h1>
          <h2 className='custom-h2'>Below we will ask you questions that will personalize your experience with us</h2>
          
          <div className="form-container">
            <div className="form-group">
              <label htmlFor='name'>Name:</label>
              <input type="text" id="name" name="name" placeholder="Full name" />
            </div>
          </div>

          <div className="form-container">
            <div className="form-group">
              <label htmlFor='email address'>Email Address:</label>
              <input type="text" id="email address" name="email address" placeholder="Valid Email Address" />
            </div>
          </div>

          <div className="form-container">
            <div className="form-group">
              <label htmlFor='monthly income'>What is your monthly income? :</label>
              <input type="text" id="monthly income" name="monthly income" placeholder="$" />
            </div>
          </div>

          <div className="form-container">
            <div className="form-group">
              <label htmlFor='monthly spending goal'>What is your ideal monthly spending goal? :</label>
              <input type="text" id="monthly spending goal" name="monthly spending goal" placeholder="$" />
            </div>
          </div>

         <div className="form-container">
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
            

         
        </div>

    );
    
  };
  
  export default Create_Account;