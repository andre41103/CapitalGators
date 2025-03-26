import React, { useState, useEffect } from 'react';
import './resources.component.css';
import { useNavigate } from 'react-router-dom';
import avatarImage from '../assets/avatar.png';

const Resources = () => {
    const navigate = useNavigate();
    const [cards, setCards] = useState([]);
    const handleProfile = () => {
      navigate('/profile');
    };

    useEffect(() => {
      const fetchData = async () => {
          try {
              const response = await fetch('http://localhost:8080/resources'); 
              if (!response.ok) {
                  throw new Error('Failed to fetch data');
              }
              const data = await response.json();
              console.log("Fetched data:", data);
              
              // some cards in the json have the trademark sign as the code number so we need to change it to the actual symbol
              const modifiedData = data.props.pageProps.pageData['category-page'].collection.cards.map(card => {
                card.name = card.name.replace(/&#174;|&reg;/g, '®');
                return card;
              });

          
              setCards(modifiedData);  // Set the modified data with the trademark symbol
          } catch (error) {
              console.error('Error fetching data:', error);
          }
      };

      fetchData();
    }, []);
  
    return (
      <>
      <div className="navbar">
        <a href="/dashboard" className="nav-make">MakeCents</a>
        <a href="/resources" className="nav-link active">Education Resources</a>
        <a href="/reports" className="nav-link">Reports</a>
        <a href="/receipts" className="nav-link">Receipt Entry</a>
        <img src={avatarImage} alt="Profile" className="avatar-icon" onClick={handleProfile} />
      </div>

      <div className="resources-content">
        <div className="vertical-containers">
          <div className='resources-container-wrapper'>
            <h3 className='container-title'>Important Credit Card Information</h3>
          <div className="individual-vertical-container resource-scrollable-container">
            <div className='scroll-content'>
              {cards.length > 0 ? (
                cards.map((card, index) => (
                  <div key={index} className="card-info">
                    <h4>{card.name}</h4>
                      <p><strong>Issuer:</strong> {card.relationships.issuer.name}</p>
                                            
                       <h5>Intro Bonuses:</h5>
                        {card.attributes.introBonuses.map((bonus, idx) => (
                             <p key={idx}>{bonus.description}</p>
                          ))}

                        <h5>Reward Rates:</h5>
                          {card.attributes.rewardRates.map((rate, idx) => (
                            <p key={idx}>{rate.explanation}</p>
                              ))}

                         <h5>Why Like This:</h5>
                             {card.variations.map((variation, idx) => (
                                 <p key={idx}>{variation.whyLikeThis}</p>
                                  ))}
                  </div>))) : (
                                <p>Loading credit card data...</p> /*if there are no cards*/
              )}
            </div>
          </div>
        </div>

        <div className='resources-container-wrapper'>
        <h3 className='container-title'>Financial Chatbox</h3>
          <div className="individual-vertical-container"></div>
        </div>

        {/* <footer className='resources-footer'></footer> */}
      </div>
    </div></>
    );
  }
  
  export default Resources;