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

    const handleSubmit = async () => {
      const requestData = {
          username,
          password,
          email,
          monthlyIncome: Number(monthlyIncome),
          spendingGoal: Number(spendingGoal),
          selectedCategories,
          selectedTopics,
      };
  
      try {
          const response = await fetch('http://localhost:8080/create_account', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestData),
          });
  
          if (response.ok) {
              const responseData = await response.json();
              console.log('Account created successfully:', responseData);
              // Optionally navigate or show success message
          } else {
              console.error('Error creating account:', response.statusText);
          }
      } catch (error) {
          console.error('Network error:', error);
      }
  };


    const [username, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [monthlyIncome, setMonthlyIncome] = useState('');
    const [spendingGoal, setSpendingGoal] = useState('');
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
        <div className="content">
          <h1 className='custom-h1'>Welcome to MakeCents!</h1>
          <h2 className='custom-h2'>Below we will ask you questions that will personalize your experience with us</h2>
          
          <div className="form-container">
            <div className="form-group">
              <label htmlFor='name'>Name:</label>
              <input type="text" id="name" name="name" placeholder="Full name" value={username} onChange={(e) => setName(e.target.value)} />
            </div>
          </div>

          <div className="form-container">
            <div className="form-group">
              <label htmlFor='email address'>Email Address:</label>
              <input type="text" id="email address" name="email address" placeholder="Valid Email Address" value={email} onChange={(e) => setEmail(e.target.value)}/>
            </div>
          </div>

          <div className="form-container">
            <div className="form-group">
              <label htmlFor='password'>Password:</label>
              <input type="password" id="password" name="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>
          </div>

          <div className="form-container">
            <div className="form-group">
              <label htmlFor='monthly income'>What is your monthly income? :</label>
              <input type="number" id="monthly income" name="monthly income" placeholder="$" value={monthlyIncome} onChange={(e) => setMonthlyIncome(parseInt(e.target.value, 10) || 0)}/>
            </div>
          </div>

          <div className="form-container">
            <div className="form-group">
              <label htmlFor='monthly spending goal'>What is your ideal monthly spending goal? :</label>
              <input type="number" id="monthly spending goal" name="monthly spending goal" placeholder="$" value={spendingGoal} onChange={(e) => setSpendingGoal(parseInt(e.target.value, 10) || 0)}/>
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


         <div className="form-container">
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

         <button onClick={handleSubmit} className='buttonStyle'>Return to Login</button>
            

         <footer className="footer"></footer>
        </div>

    );
    
  };
  
  export default Create_Account;